// ============================================================
// Row -> API JSON serializers.
//
// The frontend was built against Mongoose's default output shape
// (camelCase fields, `_id` for ids, populated refs as `{ _id, ... }`
// sub-objects). Postgres/Supabase gives us snake_case columns and plain
// uuids, so every row that leaves this backend is passed through one of
// these before `res.json(...)`, to keep the wire format identical.
// ============================================================

function authorRef(userRow) {
  if (!userRow) return null;
  return {
    _id: userRow.id,
    username: userRow.username,
    fullName: userRow.full_name,
  };
}

function serializeAuthUser(row) {
  return {
    id: row.id,
    fullName: row.full_name,
    username: row.username,
    email: row.email,
    year: row.year,
    role: row.role,
  };
}

function serializeAdminAuth(row) {
  return {
    id: row.id,
    username: row.username,
    role: row.role,
  };
}

function serializeAlumni(row) {
  return {
    _id: row.id,
    name: row.name,
    email: row.email,
    phone: row.phone,
    passOutYear: row.pass_out_year,
    company: row.company,
    role: row.role,
    skills: row.skills || [],
    linkedinUrl: row.linkedin_url,
    bio: row.bio,
    achievements: row.achievements || [],
    imageUrl: row.image_url,
    isVerified: row.is_verified,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function serializeAlumniThought(row) {
  return {
    _id: row.id,
    text: row.text,
    authorName: row.author_name,
    authorId: row.author_id,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

// event_type-specific fields that live in the `details` jsonb column.
// Flattened back onto the top level so `event.hackPrizes` etc. still work.
function serializeEvent(row) {
  const details = row.details || {};
  return {
    _id: row.id,
    eventName: row.event_name,
    eventType: row.event_type,
    startDate: row.start_date,
    endDate: row.end_date,
    venue: row.venue,
    eventMode: row.event_mode,
    organizer: row.organizer,
    poster: row.poster_url,
    posterPublicId: row.poster_path,
    thumbnailUrl: row.thumbnail_url,
    description: row.description,
    registrationLink: row.registration_link,
    contact: row.contact,
    eligibility: row.eligibility,
    maxParticipants: row.max_participants,
    fees: row.fees,
    deadlines: row.deadlines,
    startTime: row.start_time,
    endTime: row.end_time,
    ...details,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

// Splits a flat req.body (eventName, hackPrizes, ...) into the core
// columns + the leftover type-specific fields that belong in `details`.
const EVENT_CORE_FIELDS = {
  eventName: 'event_name',
  eventType: 'event_type',
  startDate: 'start_date',
  endDate: 'end_date',
  venue: 'venue',
  eventMode: 'event_mode',
  organizer: 'organizer',
  description: 'description',
  registrationLink: 'registration_link',
  contact: 'contact',
  eligibility: 'eligibility',
  maxParticipants: 'max_participants',
  fees: 'fees',
  deadlines: 'deadlines',
  startTime: 'start_time',
  endTime: 'end_time',
};

function splitEventPayload(body) {
  const columns = {};
  const details = {};
  for (const [key, value] of Object.entries(body || {})) {
    if (value === undefined) continue;
    if (EVENT_CORE_FIELDS[key]) {
      columns[EVENT_CORE_FIELDS[key]] = value;
    } else {
      details[key] = value;
    }
  }
  return { columns, details };
}

function serializeLeaderboardRow(row) {
  return {
    _id: row.id,
    category: row.category,
    name: row.name,
    roll: row.roll,
    year: row.year,
    score: row.score,
    time: row.time,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function serializePost(row, { author, upvotes = [], comments } = {}) {
  const out = {
    _id: row.id,
    title: row.title,
    content: row.content,
    author: authorRef(author) || row.author_id,
    isAnonymous: row.is_anonymous,
    images: (row.images || []).map((img) => ({ url: img.url, publicId: img.path })),
    upvotes,
    isDeleted: row.is_deleted,
    deletedAt: row.deleted_at,
    deletedBy: row.deleted_by,
    isEdited: row.is_edited,
    editedAt: row.edited_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
  if (comments !== undefined) out.comments = comments;
  return out;
}

function serializeComment(row, { author, upvotes = [], replies = [], parentPost } = {}) {
  return {
    _id: row.id,
    content: row.content,
    author: authorRef(author) || row.author_id,
    parentPost: parentPost !== undefined ? parentPost : row.parent_post_id,
    isAnonymous: row.is_anonymous,
    upvotes,
    replies,
    isDeleted: row.is_deleted,
    deletedAt: row.deleted_at,
    deletedBy: row.deleted_by,
    isEdited: row.is_edited,
    editedAt: row.edited_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function serializeReply(row, { author, upvotes = [], parentComment, parentPost } = {}) {
  return {
    _id: row.id,
    content: row.content,
    author: authorRef(author) || row.author_id,
    parentComment: parentComment !== undefined ? parentComment : row.parent_comment_id,
    parentPost: parentPost !== undefined ? parentPost : row.parent_post_id,
    isAnonymous: row.is_anonymous,
    upvotes,
    isDeleted: row.is_deleted,
    deletedAt: row.deleted_at,
    deletedBy: row.deleted_by,
    isEdited: row.is_edited,
    editedAt: row.edited_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function serializeProfile(row) {
  if (!row) return null;
  return {
    _id: row.id,
    userId: row.user_id,
    name: row.name,
    year: row.year,
    dob: row.dob,
    registerNumber: row.register_number,
    bio: row.bio,
    skills: row.skills || [],
    socialLinks: {
      github: row.social_github,
      leetcode: row.social_leetcode,
      linkedin: row.social_linkedin,
    },
    profileImage: {
      url: row.profile_image_url,
      publicId: row.profile_image_path,
    },
    resume: {
      url: row.resume_url,
      publicId: row.resume_path,
      filename: row.resume_filename,
    },
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function serializeQuestionPaper(row, { author } = {}) {
  return {
    _id: row.id,
    semester: row.semester,
    subjectCode: row.subject_code,
    subjectName: row.subject_name,
    examType: row.exam_type,
    fileName: row.file_name,
    fileUrl: row.file_url,
    publicId: row.file_path,
    author: author
      ? { _id: author.id, username: author.username, fullName: author.full_name, email: author.email }
      : row.author_id,
    uploadedAt: row.uploaded_at,
  };
}

function serializeAchievement(row, { user } = {}) {
  return {
    _id: row.id,
    userId: user ? { _id: user.id, fullName: user.full_name, username: user.username, year: user.year } : row.user_id,
    title: row.title,
    description: row.description,
    certificate: {
      url: row.certificate_url,
      publicId: row.certificate_path,
    },
    status: row.status,
    reviewedBy: row.reviewed_by,
    reviewedAt: row.reviewed_at,
    rejectionReason: row.rejection_reason,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function serializeUpdate(row) {
  return { _id: row.id, title: row.title, createdAt: row.created_at };
}

function serializeStats(row) {
  return { key: row.key, value: row.value };
}

module.exports = {
  authorRef,
  serializeAuthUser,
  serializeAdminAuth,
  serializeAlumni,
  serializeAlumniThought,
  serializeEvent,
  splitEventPayload,
  serializeLeaderboardRow,
  serializePost,
  serializeComment,
  serializeReply,
  serializeProfile,
  serializeQuestionPaper,
  serializeAchievement,
  serializeUpdate,
  serializeStats,
};
