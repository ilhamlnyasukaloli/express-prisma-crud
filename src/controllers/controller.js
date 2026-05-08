const prisma = require("../lib/prisma");
const bcrypt = require("bcrypt");

const SALT_ROUNDS = 10;

const sanitizeUser = (user) => {
  const { password, ...rest } = user;
  return rest;
};

// ─── GET ALL USERS ──────────────────────────────────────────────────────────

/**
 * GET /users
 * Query params: page, limit, search (name/email)
 */
const getAllUsers = async (req, res) => {
  try {
    const page  = Math.max(1, parseInt(req.query.page)  || 1);
    const limit = Math.min(100, parseInt(req.query.limit) || 10);
    const skip  = (page - 1) * limit;
    const search = req.query.search?.trim() || "";

    const where = search
      ? {
          OR: [
            { name:  { contains: search, mode: "insensitive" } },
            { email: { contains: search, mode: "insensitive" } },
          ],
        }
      : {};

    const [users, total] = await prisma.$transaction([
      prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.user.count({ where }),
    ]);

    return res.status(200).json({
      success: true,
      data: users.map(sanitizeUser),
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("[getAllUsers]", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// ─── GET USER BY ID ─────────────────────────────────────────────────────────

/**
 * GET /users/:id
 */
const getUserById = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ success: false, message: "Invalid ID" });
    }

    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    return res.status(200).json({ success: true, data: sanitizeUser(user) });
  } catch (error) {
    console.error("[getUserById]", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// ─── CREATE USER ────────────────────────────────────────────────────────────

/**
 * POST /users
 * Body: { name, email, password, role? }
 */
const createUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return res.status(409).json({ success: false, message: "Email is already in use" });
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        ...(role && { role }),
      },
    });

    return res.status(201).json({
      success: true,
      message: "User created successfully",
      data: sanitizeUser(user),
    });
  } catch (error) {
    console.error("[createUser]", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// ─── UPDATE USER ────────────────────────────────────────────────────────────

/**
 * PUT /users/:id
 * Body: { name?, email?, password?, role? }
 */
const updateUser = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ success: false, message: "Invalid ID" });
    }

    const existing = await prisma.user.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const { name, email, password, role } = req.body;
    const updateData = {};

    if (name)     updateData.name  = name;
    if (role)     updateData.role  = role;
    
    if (email && email !== existing.email) {
      const emailTaken = await prisma.user.findUnique({ where: { email } });
      if (emailTaken) {
        return res.status(409).json({ success: false, message: "Email is already in use" });
      }
      updateData.email = email;
    }

    if (password) {
      updateData.password = await bcrypt.hash(password, SALT_ROUNDS);
    }

    const user = await prisma.user.update({ where: { id }, data: updateData });

    return res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: sanitizeUser(user),
    });
  } catch (error) {
    console.error("[updateUser]", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// ─── DELETE USER ────────────────────────────────────────────────────────────

/**
 * DELETE /users/:id
 */
const deleteUser = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ success: false, message: "Invalid ID" });
    }

    const existing = await prisma.user.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    await prisma.user.delete({ where: { id } });

    return res.status(200).json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    console.error("[deleteUser]", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
};
