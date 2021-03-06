<template>
  <section>
    <div class="card">
      <header class="card-header">
        <h2 class="card-header-title">{{ $t("labels.invite_form_header") }}</h2>
      </header>
      <div class="card-content has-text-left p-t-xl p-r-xl p-l-xl p-b-lg">
        <form method="POST" class="invite_form" @submit.prevent="sendReferralEmail">
          <b-field>
            <b-input v-model="emails" :placeholder="$t('settings.emails_input')" expanded type="text"/>
            <p class="control">
              <button class="button is-venue-purple">{{ $t("buttons.btn_send_email") }}</button>
            </p>
          </b-field>
          <span class="is-size-6 has-text-grey"> {{ $t("messages.invite_friend_note") }} </span>
          <p v-show="message" :class="{ 'has-text-success' : isSuccess, 'has-text-danger' : hasError }">{{ message }}</p>
        </form>
        <hr>
        <b-field>
          <b-input v-model="referralLink" expanded type="text"/>
          <button v-clipboard:copy="referralLink" class="button is-venue-purple">{{ $t("buttons.btn_copy_link") }}</button>
        </b-field>
        <social-sharing :url="referralLink"
                        :quote="$t('messages.social_sharing_text') + referralLink"
                        :title="$t('messages.social_sharing_twitter')"
                        :description="$t('messages.social_sharing_text')"
                        inline-template>
          <div class="has-text-centered p-t-md">
            <network network="facebook">
              <i class="facebook-color fab fa-facebook-square fa-2x p-r-sm social-icon"/>
            </network>
            <network network="twitter">
              <i class="twitter-color fab fa-twitter fa-2x p-r-sm social-icon"/>
            </network>
            <network network="telegram">
              <i class="telegram-color fab fa-telegram fa-2x p-r-sm social-icon"/>
            </network>
          </div>
        </social-sharing>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  data() {
    let data = {
      referralCode: "",
      referralLink: "",
      emails: "",
      message: "",
      isSuccess: true,
      hasError: false
    };
    const isAuthenticated = this.$auth.loggedIn;
    if (isAuthenticated) {
      Object.assign(data, {
        referralCode: this.$auth.user.referral_code
      });
    }
    return data;
  },
  mounted() {
    this.referralLink =
      location.protocol +
      "//" +
      location.host +
      "/signup?code=" +
      this.referralCode;
  },
  methods: {
    async sendReferralEmail() {
      let emailsList = this.emails.replace(" ", "");
      let referralEmails = emailsList.split(",");
      try {
        const result = await this.$axios.$post("/manage/send-referrals/", {
          emails: referralEmails
        });
        if (result.result === true) {
          this.displaySuccessMessage();
        }
      } catch (error) {
        this.displayErrorMessage();
      }
      this.emails = "";
    },
    displaySuccessMessage() {
      this.message = this.$t("messages.email_is_sent");
      this.isSuccess = true;
      this.hasError = false;
    },
    displayErrorMessage() {
      this.message = this.$t("messages.incorrect_email_input");
      this.hasError = true;
      this.isSuccess = false;
    }
  }
};
</script>

<style>
.invite_form {
  max-width: none;
}
.twitter-color {
  color: #1da1f2;
}
.facebook-color {
  color: #3b5998;
}
.telegram-color {
  color: #0088cc;
}
.social-icon:hover {
  cursor: pointer;
}
</style>
