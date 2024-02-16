import { Tweet } from "@prisma/client";
import { prismaClient } from "../clients/db";
import { redisClient } from "../clients/redis";

export interface CreateTweetPayload {
  content: string;
  imageURL?: string;
  userId: string;
}
class TweetService {
  public static async createTweet(data: CreateTweetPayload) {
    const rateLimitFlag = await redisClient.get(
      `RATE_LIMIT_TWEET:${data.userId}`
    );
    if (rateLimitFlag) {
      throw new Error("Please Wait......");
    }
    const tweet = await prismaClient.tweet.create({
      data: {
        content: data.content,
        imageURL: data.imageURL,
        author: { connect: { id: data.userId } },
      },
    });

    console.log(tweet);
    await redisClient.setex(`RATE_LIMIT_TWEET:${data.userId}`, 10, 1);
    await redisClient.del("ALL_TWEETS");
    return tweet;
  }

  public static async getAllTweets() {
    const cachedTweets = await redisClient.get("ALL_TWEETS");
    if (cachedTweets) return JSON.parse(cachedTweets);
    const tweets = await prismaClient.tweet.findMany({
      orderBy: { createdAt: "desc" },
    });
    await redisClient.set("ALL_TWEETS", JSON.stringify(tweets));
    return tweets;
  }

  public static async toggleLike(userId: string, tweetId: string) {
    await redisClient.del("ALL_TWEETS");
    const existingTweet = await prismaClient.tweet.findUnique({
      where: { id: tweetId },
    });

    if (!existingTweet) {
      throw new Error(`Tweet with ID ${tweetId} not found`);
    }

    const hasLiked = existingTweet.likeIds.includes(userId);

    if (hasLiked) {
      const updatedTweet = await prismaClient.tweet.update({
        where: { id: tweetId },
        data: {
          likeIds: {
            set: existingTweet.likeIds.filter((userId) => userId !== userId),
          },
        },
      });
      return updatedTweet;
    } else {
      const updatedTweet = await prismaClient.tweet.update({
        where: { id: tweetId },
        data: {
          likeIds: {
            push: userId,
          },
        },
      });
      return updatedTweet;
    }
  }
}

export default TweetService;
