const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = 'mlm-secret-key-change-in-production';

// Middleware
app.use(cors());
app.use(express.json());

// File path
const MEMBERS_FILE = path.join(__dirname, 'members.json');

// Utility functions to read/write JSON file
const readMembers = async () => {
    try {
        const data = await fs.readFile(MEMBERS_FILE, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        return [];
    }
};

const writeMembers = async (members) => {
    await fs.writeFile(MEMBERS_FILE, JSON.stringify(members, null, 2));
};

// Generate unique member code
const generateMemberCode = async () => {
    const members = await readMembers();
    const maxCode = members.length > 0 
        ? Math.max(...members.map(m => parseInt(m.member_code.replace('MEM', '')))) 
        : 0;
    return `MEM${String(maxCode + 1).padStart(5, '0')}`;
};

// Find member by member code
const findMemberByCode = async (memberCode) => {
    const members = await readMembers();
    return members.find(m => m.member_code === memberCode);
};

// Update member counts recursively upward
const updateParentCounts = async (sponsorCode, position) => {
    const members = await readMembers();
    let currentSponsor = members.find(m => m.member_code === sponsorCode);
    
    while (currentSponsor) {
        if (position === 'left') {
            currentSponsor.left_count += 1;
        } else {
            currentSponsor.right_count += 1;
        }
        
        await writeMembers(members);
        
        // Move to parent
        if (currentSponsor.sponsor_code) {
            currentSponsor = members.find(m => m.member_code === currentSponsor.sponsor_code);
        } else {
            break;
        }
    }
};

// Find next available position (Spill Logic)
const findAvailablePosition = async (sponsorCode, preferredPosition) => {
    const members = await readMembers();
    const sponsor = members.find(m => m.member_code === sponsorCode);
    
    if (!sponsor) {
        return null;
    }
    
    // Check if preferred position is available
    if (preferredPosition === 'left' && !sponsor.left_member) {
        return { sponsor: sponsor.member_code, position: 'left' };
    }
    if (preferredPosition === 'right' && !sponsor.right_member) {
        return { sponsor: sponsor.member_code, position: 'right' };
    }
    
    // Spill logic: find next available position recursively
    const queue = [{ code: sponsorCode, pos: preferredPosition }];
    
    while (queue.length > 0) {
        const { code, pos } = queue.shift();
        const currentMember = members.find(m => m.member_code === code);
        
        if (!currentMember) continue;
        
        if (pos === 'left') {
            if (!currentMember.left_member) {
                return { sponsor: currentMember.member_code, position: 'left' };
            }
            // Continue searching in the left subtree
            queue.push({ code: currentMember.left_member, pos: 'left' });
        } else {
            if (!currentMember.right_member) {
                return { sponsor: currentMember.member_code, position: 'right' };
            }
            // Continue searching in the right subtree
            queue.push({ code: currentMember.right_member, pos: 'right' });
        }
    }
    
    return null;
};

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Access token required' });
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'Invalid or expired token' });
        }
        req.user = user;
        next();
    });
};

// Register/Join Member Endpoint
app.post('/api/members/register', async (req, res) => {
    try {
        const { name, email, mobile, password, sponsor_code, position } = req.body;

        // Validation
        if (!name || !email || !mobile || !password) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        if (!['left', 'right'].includes(position)) {
            return res.status(400).json({ error: 'Position must be "left" or "right"' });
        }

        const members = await readMembers();

        // Check if email already exists
        const existingMember = members.find(m => m.email === email);
        if (existingMember) {
            return res.status(400).json({ error: 'Email already registered' });
        }

        let actualSponsor = null;
        let actualPosition = position;

        // For first member (root), no sponsor needed
        if (members.length === 0) {
            if (sponsor_code) {
                return res.status(400).json({ error: 'First member should not have a sponsor' });
            }
        } else {
            // Validate sponsor code
            if (!sponsor_code) {
                return res.status(400).json({ error: 'Sponsor code is required' });
            }

            const sponsor = await findMemberByCode(sponsor_code);
            if (!sponsor) {
                return res.status(400).json({ error: 'Invalid Sponsor Code' });
            }

            // Find available position (apply spill logic)
            const availableSpot = await findAvailablePosition(sponsor_code, position);
            
            if (!availableSpot) {
                return res.status(400).json({ error: 'No available position found' });
            }

            actualSponsor = availableSpot.sponsor;
            actualPosition = availableSpot.position;
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Generate member code
        const memberCode = await generateMemberCode();

        // Create new member
        const newMember = {
            id: uuidv4(),
            member_code: memberCode,
            name,
            email,
            mobile,
            password: hashedPassword,
            sponsor_code: actualSponsor,
            position: actualPosition,
            left_member: null,
            right_member: null,
            left_count: 0,
            right_count: 0,
            joining_date: new Date().toISOString()
        };

        members.push(newMember);

        // Update sponsor's left or right member
        if (actualSponsor) {
            const sponsorMember = members.find(m => m.member_code === actualSponsor);
            if (actualPosition === 'left') {
                sponsorMember.left_member = memberCode;
            } else {
                sponsorMember.right_member = memberCode;
            }

            // Update parent counts recursively
            await updateParentCounts(actualSponsor, actualPosition);
        }

        await writeMembers(members);

        res.status(201).json({
            message: 'Member registered successfully',
            member_code: memberCode,
            placed_under: actualSponsor || 'ROOT',
            position: actualPosition,
            member: {
                member_code: memberCode,
                name: newMember.name,
                email: newMember.email,
                mobile: newMember.mobile
            }
        });

    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Login Endpoint
app.post('/api/members/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        const members = await readMembers();
        const member = members.find(m => m.email === email);

        if (!member) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const isValidPassword = await bcrypt.compare(password, member.password);
        if (!isValidPassword) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Generate JWT token
        const token = jwt.sign(
            { 
                id: member.id, 
                member_code: member.member_code,
                email: member.email 
            },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({
            message: 'Login successful',
            token,
            member: {
                member_code: member.member_code,
                name: member.name,
                email: member.email,
                mobile: member.mobile
            }
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get Member Profile
app.get('/api/members/profile', authenticateToken, async (req, res) => {
    try {
        const members = await readMembers();
        const member = members.find(m => m.member_code === req.user.member_code);

        if (!member) {
            return res.status(404).json({ error: 'Member not found' });
        }

        // Remove password from response
        const { password, ...memberData } = member;

        res.json(memberData);

    } catch (error) {
        console.error('Profile fetch error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get Downline Members (Left and Right)
app.get('/api/members/downline', authenticateToken, async (req, res) => {
    try {
        const members = await readMembers();
        const member = members.find(m => m.member_code === req.user.member_code);

        if (!member) {
            return res.status(404).json({ error: 'Member not found' });
        }

        // Get left downline
        const leftDownline = [];
        if (member.left_member) {
            const collectDownline = (memberCode, list) => {
                const m = members.find(mem => mem.member_code === memberCode);
                if (m) {
                    list.push({
                        member_code: m.member_code,
                        name: m.name,
                        email: m.email,
                        mobile: m.mobile,
                        position: m.position,
                        joining_date: m.joining_date,
                        left_count: m.left_count,
                        right_count: m.right_count
                    });
                    if (m.left_member) collectDownline(m.left_member, list);
                    if (m.right_member) collectDownline(m.right_member, list);
                }
            };
            collectDownline(member.left_member, leftDownline);
        }

        // Get right downline
        const rightDownline = [];
        if (member.right_member) {
            const collectDownline = (memberCode, list) => {
                const m = members.find(mem => mem.member_code === memberCode);
                if (m) {
                    list.push({
                        member_code: m.member_code,
                        name: m.name,
                        email: m.email,
                        mobile: m.mobile,
                        position: m.position,
                        joining_date: m.joining_date,
                        left_count: m.left_count,
                        right_count: m.right_count
                    });
                    if (m.left_member) collectDownline(m.left_member, list);
                    if (m.right_member) collectDownline(m.right_member, list);
                }
            };
            collectDownline(member.right_member, rightDownline);
        }

        res.json({
            total_left: member.left_count,
            total_right: member.right_count,
            left_downline: leftDownline,
            right_downline: rightDownline,
            direct_left: member.left_member ? members.find(m => m.member_code === member.left_member) : null,
            direct_right: member.right_member ? members.find(m => m.member_code === member.right_member) : null
        });

    } catch (error) {
        console.error('Downline fetch error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Verify sponsor code
app.get('/api/members/verify-sponsor/:code', async (req, res) => {
    try {
        const { code } = req.params;
        const member = await findMemberByCode(code);

        if (!member) {
            return res.status(404).json({ 
                valid: false, 
                error: 'Invalid Sponsor Code' 
            });
        }

        res.json({
            valid: true,
            sponsor: {
                member_code: member.member_code,
                name: member.name,
                left_filled: !!member.left_member,
                right_filled: !!member.right_member
            }
        });

    } catch (error) {
        console.error('Verify sponsor error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get all members (for admin/testing)
app.get('/api/members/all', authenticateToken, async (req, res) => {
    try {
        const members = await readMembers();
        const sanitizedMembers = members.map(({ password, ...rest }) => rest);
        res.json(sanitizedMembers);
    } catch (error) {
        console.error('Fetch all members error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'MLM Binary Tree Backend is running!' });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 MLM Binary Tree Backend running on http://localhost:${PORT}`);
    console.log(`📊 API endpoints available at http://localhost:${PORT}/api`);
});
