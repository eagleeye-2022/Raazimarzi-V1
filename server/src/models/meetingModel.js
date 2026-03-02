import mongoose from "mongoose";

const meetingSchema = new mongoose.Schema(
  {
    // ═══════════ BASIC INFO ═══════════
    meetingTitle: {
      type: String,
      required: [true, "Meeting title is required"],
      trim: true,
    },

    description: {
      type: String,
      trim: true,
    },

    // ═══════════ CASE ASSOCIATION ═══════════
    caseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Case",
      required: [true, "Meeting must be associated with a case"],
      index: true,
    },

    // ═══════════ MEETING TYPE ═══════════
    meetingType: {
      type: String,
      required: true,
      enum: [
        "Initial Consultation",
        "Mediation Session",
        "Hearing",
        "Settlement Discussion",
        "Evidence Presentation",
        "Final Hearing",
        "Follow-up Meeting",
        "Other",
      ],
    },

    // ═══════════ SCHEDULING ═══════════
    scheduledDate: {
      type: Date,
      required: [true, "Meeting date is required"],
      index: true,
    },

    startTime: {
      type: String, // "14:00" (24-hour format HH:mm)
      required: [true, "Start time is required"],
    },

    endTime: {
      type: String, // "15:30"
      required: [true, "End time is required"],
    },

    duration: {
      type: Number, // in minutes
      required: true,
    },

    timezone: {
      type: String,
      default: "Asia/Kolkata",
    },

    // ═══════════ PARTICIPANTS ═══════════
    organizer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    mediator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      index: true,
    },

    participants: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        role: {
          type: String,
          enum: ["petitioner", "defendant", "witness", "legal_advisor", "observer"],
        },
        attendance: {
          type: String,
          enum: ["pending", "confirmed", "declined", "attended", "absent"],
          default: "pending",
        },
        confirmationSentAt: Date,
        confirmedAt: Date,
      },
    ],

    // ═══════════ MEETING LOCATION ═══════════
    locationType: {
      type: String,
      enum: ["virtual", "physical", "hybrid"],
      default: "virtual",
    },

    // For virtual meetings
    virtualMeeting: {
      platform: {
        type: String,
        enum: ["zoom", "google_meet", "microsoft_teams", "custom"],
      },
      meetingLink: String,
      meetingId: String,
      passcode: String,
    },

    // For physical meetings
    physicalLocation: {
      venue: String,
      address: String,
      city: String,
      state: String,
      pincode: String,
      roomNumber: String,
    },

    // ═══════════ STATUS ═══════════
    status: {
      type: String,
      enum: [
        "Scheduled",
        "Confirmed",
        "In Progress",
        "Completed",
        "Cancelled",
        "Rescheduled",
        "No Show",
      ],
      default: "Scheduled",
      index: true,
    },

    // ═══════════ MEETING OUTCOME ═══════════
    outcome: {
      summary: String,
      agreementReached: {
        type: Boolean,
        default: false,
      },
      nextSteps: String,
      recordedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      recordedAt: Date,
    },

    // ═══════════ RESCHEDULING HISTORY ═══════════
    rescheduledFrom: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Meeting",
    },

    reschedulingHistory: [
      {
        previousDate: Date,
        previousStartTime: String,
        previousEndTime: String,
        rescheduledBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        reason: String,
        rescheduledAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    // ═══════════ CANCELLATION ═══════════
    cancellationReason: String,
    cancelledBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    cancelledAt: Date,

    // ═══════════ REMINDERS ═══════════
    remindersSent: [
      {
        reminderType: {
          type: String,
          enum: ["24_hours", "1_hour", "15_minutes"],
        },
        sentAt: Date,
        recipientCount: Number,
      },
    ],

    // ═══════════ DOCUMENTS & NOTES ═══════════
    attachedDocuments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Document",
      },
    ],

    agendaItems: [
      {
        item: String,
        order: Number,
      },
    ],

    meetingNotes: String,

    // ═══════════ RECORDING (OPTIONAL) ═══════════
    recording: {
      isRecorded: {
        type: Boolean,
        default: false,
      },
      recordingUrl: String,
      recordingPassword: String,
    },

    // ═══════════ METADATA ═══════════
    isPrivate: {
      type: Boolean,
      default: false,
    },

    requiresApproval: {
      type: Boolean,
      default: false,
    },

    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    approvedAt: Date,
  },
  {
    timestamps: true,
  }
);

// ═══════════ INDEXES ═══════════
meetingSchema.index({ caseId: 1, status: 1 });
meetingSchema.index({ mediator: 1, scheduledDate: 1 });
meetingSchema.index({ "participants.user": 1 });
meetingSchema.index({ scheduledDate: 1, startTime: 1 });

// ═══════════ VIRTUAL FIELDS ═══════════
meetingSchema.virtual("isUpcoming").get(function () {
  const now = new Date();
  const meetingDateTime = new Date(this.scheduledDate);
  return meetingDateTime > now && this.status === "Scheduled";
});

meetingSchema.virtual("isPast").get(function () {
  const now = new Date();
  const meetingDateTime = new Date(this.scheduledDate);
  return meetingDateTime < now;
});

// ═══════════ METHODS ═══════════

// Check if meeting time conflicts with another meeting
meetingSchema.methods.hasConflict = async function (mediatorId) {
  const Meeting = this.constructor;
  
  const conflictingMeetings = await Meeting.find({
    _id: { $ne: this._id },
    mediator: mediatorId,
    scheduledDate: this.scheduledDate,
    status: { $in: ["Scheduled", "Confirmed", "In Progress"] },
    $or: [
      {
        // New meeting starts during existing meeting
        $and: [
          { startTime: { $lte: this.startTime } },
          { endTime: { $gt: this.startTime } },
        ],
      },
      {
        // New meeting ends during existing meeting
        $and: [
          { startTime: { $lt: this.endTime } },
          { endTime: { $gte: this.endTime } },
        ],
      },
      {
        // New meeting completely overlaps existing meeting
        $and: [
          { startTime: { $gte: this.startTime } },
          { endTime: { $lte: this.endTime } },
        ],
      },
    ],
  });

  return conflictingMeetings.length > 0;
};

// Mark meeting as completed
meetingSchema.methods.complete = async function (summary, userId) {
  this.status = "Completed";
  this.outcome = {
    summary,
    recordedBy: userId,
    recordedAt: new Date(),
  };
  await this.save();
};

// Cancel meeting
meetingSchema.methods.cancel = async function (reason, userId) {
  this.status = "Cancelled";
  this.cancellationReason = reason;
  this.cancelledBy = userId;
  this.cancelledAt = new Date();
  await this.save();
};

// Reschedule meeting
meetingSchema.methods.reschedule = async function (newDate, newStartTime, newEndTime, reason, userId) {
  this.reschedulingHistory.push({
    previousDate: this.scheduledDate,
    previousStartTime: this.startTime,
    previousEndTime: this.endTime,
    rescheduledBy: userId,
    reason,
  });

  this.scheduledDate = newDate;
  this.startTime = newStartTime;
  this.endTime = newEndTime;
  this.status = "Rescheduled";

  await this.save();
};

export default mongoose.model("Meeting", meetingSchema);