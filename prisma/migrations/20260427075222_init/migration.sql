-- CreateEnum
CREATE TYPE "Role" AS ENUM ('STUDENT', 'TEACHER', 'PARENT', 'COUNSELOR');

-- CreateEnum
CREATE TYPE "MoodState" AS ENUM ('GOOD', 'CALM', 'STRESSED', 'LOW', 'ANXIOUS', 'NUMB', 'TIRED', 'UNKNOWN');

-- CreateEnum
CREATE TYPE "MoodTrend" AS ENUM ('IMPROVING', 'STABLE', 'DECLINING');

-- CreateEnum
CREATE TYPE "StudyMethod" AS ENUM ('POMODORO', 'FEYNMAN', 'SPACED_REPETITION');

-- CreateEnum
CREATE TYPE "TherapyMode" AS ENUM ('GROUNDING', 'RELEASE', 'SOCIAL', 'EYE_GAME', 'FOCUS');

-- CreateEnum
CREATE TYPE "HeatLevel" AS ENUM ('EMPTY', 'LOW', 'MID', 'HIGH', 'PEAK');

-- CreateEnum
CREATE TYPE "EscalationStatus" AS ENUM ('NONE', 'MONITORING', 'WARM_REFERRAL', 'COUNSELOR_CONNECTED');

-- CreateEnum
CREATE TYPE "BreakType" AS ENUM ('EYE_GYMNASTICS', 'MICRO_STRETCH', 'POSTURE_CHECK');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'STUDENT',
    "language" TEXT NOT NULL DEFAULT 'en',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Student" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "onboardingDone" BOOLEAN NOT NULL DEFAULT false,
    "culturalBaseline" JSONB,
    "escalationStatus" "EscalationStatus" NOT NULL DEFAULT 'NONE',
    "escalationNote" TEXT,
    "nuriProfileScore" DOUBLE PRECISION,
    "readingScore" DOUBLE PRECISION,
    "expressionScore" DOUBLE PRECISION,

    CONSTRAINT "Student_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Teacher" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "school" TEXT,

    CONSTRAINT "Teacher_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Parent" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Parent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Counselor" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "school" TEXT,

    CONSTRAINT "Counselor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ParentStudent" (
    "parentId" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,

    CONSTRAINT "ParentStudent_pkey" PRIMARY KEY ("parentId","studentId")
);

-- CreateTable
CREATE TABLE "CounselorStudent" (
    "counselorId" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "linkedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CounselorStudent_pkey" PRIMARY KEY ("counselorId","studentId")
);

-- CreateTable
CREATE TABLE "Class" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "teacherId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Class_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClassEnrollment" (
    "classId" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "seatRow" INTEGER NOT NULL,
    "seatCol" INTEGER NOT NULL,

    CONSTRAINT "ClassEnrollment_pkey" PRIMARY KEY ("classId","studentId")
);

-- CreateTable
CREATE TABLE "ClassMoodSnapshot" (
    "id" TEXT NOT NULL,
    "classId" TEXT NOT NULL,
    "takenAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "moodCounts" JSONB NOT NULL,

    CONSTRAINT "ClassMoodSnapshot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MoodCheckIn" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "mood" "MoodState" NOT NULL,
    "cvDetected" "MoodState",
    "cameraUsed" BOOLEAN NOT NULL DEFAULT false,
    "questionAnswers" JSONB,
    "skipped" BOOLEAN NOT NULL DEFAULT false,
    "sessionStartHour" INTEGER,
    "studyMethodRec" "StudyMethod",
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MoodCheckIn_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StudySession" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "method" "StudyMethod" NOT NULL,
    "subject" TEXT,
    "plannedMins" INTEGER NOT NULL,
    "actualMins" INTEGER,
    "breaksTaken" INTEGER NOT NULL DEFAULT 0,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "moodAtStart" "MoodState",
    "moodAtEnd" "MoodState",
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endedAt" TIMESTAMP(3),
    "examScheduleId" TEXT,

    CONSTRAINT "StudySession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExamSchedule" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "examDate" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "studySlots" JSONB,

    CONSTRAINT "ExamSchedule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HealthBreak" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "breakType" "BreakType" NOT NULL,
    "durationSec" INTEGER,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "triggeredBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "HealthBreak_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TherapySession" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "mode" "TherapyMode" NOT NULL,
    "durationSec" INTEGER,
    "binauralFreqHz" DOUBLE PRECISION,
    "moodBefore" "MoodState",
    "moodAfter" "MoodState",
    "enteredVia" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TherapySession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VentEntry" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "contentHash" TEXT,
    "sentimentScore" DOUBLE PRECISION,
    "emotionalCategory" TEXT,
    "flagForReview" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "VentEntry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HeatmapEntry" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "dayOfWeek" INTEGER NOT NULL,
    "hour" INTEGER NOT NULL,
    "weekStart" TIMESTAMP(3) NOT NULL,
    "level" "HeatLevel" NOT NULL,

    CONSTRAINT "HeatmapEntry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WeeklyReport" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "weekStart" TIMESTAMP(3) NOT NULL,
    "studyHours" DOUBLE PRECISION NOT NULL,
    "wellnessScore" DOUBLE PRECISION NOT NULL,
    "avgMood" "MoodState" NOT NULL,
    "avgSleepHours" DOUBLE PRECISION,
    "avgActivityMins" DOUBLE PRECISION,
    "ventSessionCount" INTEGER NOT NULL DEFAULT 0,
    "breaksTaken" INTEGER NOT NULL DEFAULT 0,
    "nuriInsight" TEXT,
    "highlights" JSONB,
    "parentVersion" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WeeklyReport_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StudentFlag" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "severity" INTEGER NOT NULL DEFAULT 1,
    "resolvedAt" TIMESTAMP(3),
    "resolvedBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "StudentFlag_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Student_userId_key" ON "Student"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Teacher_userId_key" ON "Teacher"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Parent_userId_key" ON "Parent"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Counselor_userId_key" ON "Counselor"("userId");

-- CreateIndex
CREATE INDEX "MoodCheckIn_studentId_createdAt_idx" ON "MoodCheckIn"("studentId", "createdAt");

-- CreateIndex
CREATE INDEX "StudySession_studentId_startedAt_idx" ON "StudySession"("studentId", "startedAt");

-- CreateIndex
CREATE INDEX "HealthBreak_studentId_createdAt_idx" ON "HealthBreak"("studentId", "createdAt");

-- CreateIndex
CREATE INDEX "TherapySession_studentId_createdAt_idx" ON "TherapySession"("studentId", "createdAt");

-- CreateIndex
CREATE INDEX "VentEntry_studentId_createdAt_idx" ON "VentEntry"("studentId", "createdAt");

-- CreateIndex
CREATE INDEX "HeatmapEntry_studentId_weekStart_idx" ON "HeatmapEntry"("studentId", "weekStart");

-- CreateIndex
CREATE UNIQUE INDEX "HeatmapEntry_studentId_weekStart_dayOfWeek_hour_key" ON "HeatmapEntry"("studentId", "weekStart", "dayOfWeek", "hour");

-- CreateIndex
CREATE INDEX "WeeklyReport_studentId_weekStart_idx" ON "WeeklyReport"("studentId", "weekStart");

-- CreateIndex
CREATE UNIQUE INDEX "WeeklyReport_studentId_weekStart_key" ON "WeeklyReport"("studentId", "weekStart");

-- CreateIndex
CREATE INDEX "StudentFlag_studentId_createdAt_idx" ON "StudentFlag"("studentId", "createdAt");

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Teacher" ADD CONSTRAINT "Teacher_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Parent" ADD CONSTRAINT "Parent_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Counselor" ADD CONSTRAINT "Counselor_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ParentStudent" ADD CONSTRAINT "ParentStudent_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Parent"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ParentStudent" ADD CONSTRAINT "ParentStudent_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CounselorStudent" ADD CONSTRAINT "CounselorStudent_counselorId_fkey" FOREIGN KEY ("counselorId") REFERENCES "Counselor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CounselorStudent" ADD CONSTRAINT "CounselorStudent_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Class" ADD CONSTRAINT "Class_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "Teacher"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClassEnrollment" ADD CONSTRAINT "ClassEnrollment_classId_fkey" FOREIGN KEY ("classId") REFERENCES "Class"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClassEnrollment" ADD CONSTRAINT "ClassEnrollment_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClassMoodSnapshot" ADD CONSTRAINT "ClassMoodSnapshot_classId_fkey" FOREIGN KEY ("classId") REFERENCES "Class"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MoodCheckIn" ADD CONSTRAINT "MoodCheckIn_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudySession" ADD CONSTRAINT "StudySession_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudySession" ADD CONSTRAINT "StudySession_examScheduleId_fkey" FOREIGN KEY ("examScheduleId") REFERENCES "ExamSchedule"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExamSchedule" ADD CONSTRAINT "ExamSchedule_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HealthBreak" ADD CONSTRAINT "HealthBreak_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TherapySession" ADD CONSTRAINT "TherapySession_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VentEntry" ADD CONSTRAINT "VentEntry_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HeatmapEntry" ADD CONSTRAINT "HeatmapEntry_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WeeklyReport" ADD CONSTRAINT "WeeklyReport_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentFlag" ADD CONSTRAINT "StudentFlag_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;
