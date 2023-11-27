import { GraphQLString, GraphQLNonNull } from 'graphql';
import { mutationWithClientMutationId } from 'graphql-relay';

import { GraphQLContext } from '../../graphql/types';

import { CommunityModel } from '../CommunityModel';
import { CommunityType } from '../CommunityType';

export const communityExitAsAdmin = mutationWithClientMutationId({
  name: 'CommunityExitAsAdmin',
  inputFields: {
    communityName: { type: new GraphQLNonNull(GraphQLString) },
  },
  mutateAndGetPayload: async ({ communityName }, ctx: GraphQLContext) => {
    if (!ctx.user) {
      throw new Error('You are not logged in. Please, try again!');
    }

    const foundCommunity = await CommunityModel.findOne({
      name: communityName,
    });

    if (!foundCommunity) {
      throw new Error("This community doesn't exist. Please, try again.");
    }

    const foundMemberIdInCommuntiy = foundCommunity.members.includes(
      ctx.user._id,
    );
    const foundCommuntiyIdInUser = ctx.user?.communities.includes(
      foundCommunity._id,
    );

    if (!foundMemberIdInCommuntiy || !foundCommuntiyIdInUser) {
      throw new Error('You are not a member of this community.');
    }

    if (foundCommunity.mods.length > 0) {
      await foundCommunity.updateOne({
        admin: foundCommunity.mods[0]._id,
        $pull: {
          mods: foundCommunity.mods[0]._id,
          members: ctx.user._id,
        },
      });
    } else {
      await foundCommunity.remove();
    }

    await ctx.user?.updateOne({ $pull: { communities: foundCommunity._id } });

    return {
      userId: ctx.user._id,
      communityId: foundCommunity._id,
    };
  },
  outputFields: () => ({
    community: {
      type: CommunityType,
      resolve: async ({ communityId }) =>
        await CommunityModel.findOne({ _id: communityId }),
    },
  }),
});
