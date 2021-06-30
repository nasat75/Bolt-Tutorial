import { FindAndModifyWriteOpResultObject, MongoEntityManager } from "typeorm";
import * as types from "./interface";

export const users = async ({
  db,
  queryFindUser,
}: {
  db: MongoEntityManager;
  queryFindUser: types.QueryFindUser;
}): Promise<FindAndModifyWriteOpResultObject> => {
  return await db.findOneAndReplace(
    "users",
    { slackID: queryFindUser.slackID },
    queryFindUser,
    {
      upsert: true,
    }
  );
};

export const usersPosts = async ({
  db,
  queryFindMessage,
}: {
  db: MongoEntityManager;
  queryFindMessage: types.QueryFindMessage;
}): Promise<FindAndModifyWriteOpResultObject> => {
  return await db.findOneAndReplace(
    "users_posts",
    { ts: queryFindMessage.ts },
    queryFindMessage,
    { upsert: true }
  );
};

export const timeline = async ({
  db,
  queryFindTimeline,
  queryFindMessage,
}: {
  db: MongoEntityManager;
  queryFindTimeline: types.QueryFindTimeline;
  queryFindMessage: types.QueryFindMessage;
}): Promise<FindAndModifyWriteOpResultObject> => {
  return await db.findOneAndReplace(
    "timeline",
    { ts: queryFindTimeline.ts },
    queryFindMessage,
    { upsert: true }
  );
};
