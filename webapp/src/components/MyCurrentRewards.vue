<template>
  <div>
    <div class="is-size-3 has-text-centered">
      <span v-if="hasCampaignData" class="is-size-3 has-text-centered">{{ myTokens }}</span>
      <span v-else>N/A</span> VTX
    </div>
    <div v-if="bonus > 0" class="has-text-centered">
      <span>{{ $t('labels.bonus_percent', { rank: forumUserRank, bonus }) }}</span>    
    </div>
    <div class="is-size-5 has-text-centered text-transform-uppercase">
      <span class="icon"><i class="fas fa-star" style="color:#fbc02d"/></span>{{ $t('labels.my_current_rewards') }}
    </div>
  </div>
</template>

<script>
import numeral from "numeral";

export default {
  props: {
    showDetailsButton: {
      type: Boolean,
      default: true
    }
  },
  data() {
    const hasCampaignData = this.$store.state.userStats.hasCampaignData;
    const data = {
      hasCampaignData,
      bonus: 0,
      myTokens: 0,
      forumUserRank: ""
    };
    const hasStats =
      this.$auth.loggedIn && this.$store.state.userStats.fresh === false;

    if (hasCampaignData && hasStats) {
      Object.assign(data, {
        bonus: this.$store.state.userStats.profile_level[0].rankBonusPercentage,
        myTokens: numeral(
          this.$store.state.userStats.profile_level[0].VTX_Tokens
        ).format(),
        forumUserRank: this.$store.state.userStats.profile_level[0]
          .forumUserRank
      });
    }
    return data;
  }
};
</script>
