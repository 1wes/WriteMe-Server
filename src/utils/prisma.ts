import express from 'express';

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default prisma;