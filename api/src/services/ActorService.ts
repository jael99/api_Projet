import { PrismaClient, actor } from "@prisma/client";
import { BaseService } from "./BaseService";

const prisma = new PrismaClient();

export class ActorService extends BaseService<actor> {
  constructor() {
    super(prisma.actor, "actor_id");
  }
}
