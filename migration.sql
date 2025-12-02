-- MarVoy MVP Database Schema
-- Generated from Prisma schema

-- Create enum types
CREATE TYPE "OrganizationStatus" AS ENUM ('ACTIVE', 'SUSPENDED', 'CANCELLED');
CREATE TYPE "SubscriptionPlan" AS ENUM ('STARTER', 'PROFESSIONAL', 'ENTERPRISE');
CREATE TYPE "UserRole" AS ENUM ('ROOT_ADMIN', 'ORG_ADMIN', 'ORG_USER');
CREATE TYPE "VoyageStatus" AS ENUM ('ESTIMATE', 'ACTUAL', 'FROZEN');
CREATE TYPE "PortCallStatus" AS ENUM ('PLANNED', 'IN_PROGRESS', 'COMPLETED');
CREATE TYPE "CargoStatus" AS ENUM ('PLANNED', 'LOADING', 'LOADED', 'DISCHARGING', 'DISCHARGED');
CREATE TYPE "CharterPartyType" AS ENUM ('TIME_CHARTER', 'VOYAGE_CHARTER', 'BAREBOAT');
CREATE TYPE "LaycanType" AS ENUM ('FIXED', 'REVERSIBLE', 'AVERAGE');
CREATE TYPE "ActivityType" AS ENUM ('ARRIVAL', 'BERTHED', 'NOR_TENDERED', 'COMMENCED_LOADING', 'COMPLETED_LOADING', 'COMMENCED_DISCHARGING', 'COMPLETED_DISCHARGING', 'SAILED');

-- Create tables
CREATE TABLE "Organization" (
    "id" TEXT NOT NULL PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL UNIQUE,
    "status" "OrganizationStatus" NOT NULL DEFAULT 'ACTIVE',
    "subscriptionPlan" "SubscriptionPlan" NOT NULL DEFAULT 'STARTER',
    "contactEmail" TEXT NOT NULL,
    "contactName" TEXT,
    "defaultCurrency" TEXT NOT NULL DEFAULT 'USD',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
);

CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
    "email" TEXT NOT NULL UNIQUE,
    "name" TEXT,
    "role" "UserRole" NOT NULL DEFAULT 'ORG_USER',
    "organizationId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "User_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE TABLE "Voyage" (
    "id" TEXT NOT NULL PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
    "voyageNumber" TEXT NOT NULL,
    "vesselName" TEXT NOT NULL,
    "vesselIMO" TEXT,
    "status" "VoyageStatus" NOT NULL DEFAULT 'ESTIMATE',
    "organizationId" TEXT NOT NULL,
    "createdById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Voyage_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Voyage_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE TABLE "PortCall" (
    "id" TEXT NOT NULL PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
    "voyageId" TEXT NOT NULL,
    "portName" TEXT NOT NULL,
    "portCode" TEXT,
    "country" TEXT,
    "sequence" INTEGER NOT NULL,
    "eta" TIMESTAMP(3),
    "etd" TIMESTAMP(3),
    "status" "PortCallStatus" NOT NULL DEFAULT 'PLANNED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "PortCall_voyageId_fkey" FOREIGN KEY ("voyageId") REFERENCES "Voyage"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE "Cargo" (
    "id" TEXT NOT NULL PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
    "voyageId" TEXT NOT NULL,
    "cargoName" TEXT NOT NULL,
    "quantity" DECIMAL(65,30) NOT NULL,
    "unit" TEXT NOT NULL DEFAULT 'MT',
    "loadPortId" TEXT,
    "dischargePortId" TEXT,
    "status" "CargoStatus" NOT NULL DEFAULT 'PLANNED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Cargo_voyageId_fkey" FOREIGN KEY ("voyageId") REFERENCES "Voyage"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Cargo_loadPortId_fkey" FOREIGN KEY ("loadPortId") REFERENCES "PortCall"("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Cargo_dischargePortId_fkey" FOREIGN KEY ("dischargePortId") REFERENCES "PortCall"("id") ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE TABLE "CharterParty" (
    "id" TEXT NOT NULL PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
    "voyageId" TEXT NOT NULL,
    "cpNumber" TEXT NOT NULL,
    "cpType" "CharterPartyType" NOT NULL,
    "charterer" TEXT NOT NULL,
    "owner" TEXT,
    "laycanType" "LaycanType" NOT NULL DEFAULT 'FIXED',
    "laytimeAllowed" DECIMAL(65,30),
    "demurrageRate" DECIMAL(65,30),
    "despatchRate" DECIMAL(65,30),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "CharterParty_voyageId_fkey" FOREIGN KEY ("voyageId") REFERENCES "Voyage"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE "LaytimeCalculation" (
    "id" TEXT NOT NULL PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
    "voyageId" TEXT NOT NULL,
    "charterPartyId" TEXT NOT NULL,
    "laytimeUsed" DECIMAL(65,30) NOT NULL,
    "demurrage" DECIMAL(65,30),
    "despatch" DECIMAL(65,30),
    "calculatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "calculatedById" TEXT NOT NULL,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "LaytimeCalculation_voyageId_fkey" FOREIGN KEY ("voyageId") REFERENCES "Voyage"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "LaytimeCalculation_charterPartyId_fkey" FOREIGN KEY ("charterPartyId") REFERENCES "CharterParty"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "LaytimeCalculation_calculatedById_fkey" FOREIGN KEY ("calculatedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE TABLE "PortActivity" (
    "id" TEXT NOT NULL PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
    "portCallId" TEXT NOT NULL,
    "activityType" "ActivityType" NOT NULL,
    "activityTime" TIMESTAMP(3) NOT NULL,
    "remarks" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "PortActivity_portCallId_fkey" FOREIGN KEY ("portCallId") REFERENCES "PortCall"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- Create indexes
CREATE INDEX "User_organizationId_idx" ON "User"("organizationId");
CREATE INDEX "Voyage_organizationId_idx" ON "Voyage"("organizationId");
CREATE INDEX "PortCall_voyageId_idx" ON "PortCall"("voyageId");
CREATE INDEX "Cargo_voyageId_idx" ON "Cargo"("voyageId");
CREATE INDEX "CharterParty_voyageId_idx" ON "CharterParty"("voyageId");
CREATE INDEX "LaytimeCalculation_voyageId_idx" ON "LaytimeCalculation"("voyageId");
CREATE INDEX "PortActivity_portCallId_idx" ON "PortActivity"("portCallId");

-- Enable Row Level Security
ALTER TABLE "Organization" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "User" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Voyage" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "PortCall" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Cargo" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "CharterParty" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "LaytimeCalculation" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "PortActivity" ENABLE ROW LEVEL SECURITY;
