<template>
  <div class="home-entry">
    <office-notice/>
    <bg-box/>
    <search-bar/>
    <ul class="tag-list">
      <li class="tag-item" v-for="tag in tagList" :key="tag.tag_id" @click="jumpQa(tag.tag_id)">
        <image-loading class="tag-icon" alt="icon" :src="tag.icon"/>
        <h2 class="tag-text" v-text="tag.text"></h2>
      </li>
    </ul>
  </div>
</template>

<script>
import OfficeNotice from '../home/components/OfficeNotice/index';
import SearchBar from '@/components/SearchBar';
import BgBox from '@/components/BgBox';
import msgQaLogo from '@/assets/img/logo/msg-qa.svg';
import docQaLogo from '@/assets/img/logo/doc-qa.svg';
import meetingQaLogo from '@/assets/img/logo/meeting-qa.svg';
import calendarQaLogo from '@/assets/img/logo/calendar-qa.svg';
import wpsQaLogo from '@/assets/img/logo/wps-qa.svg';
import macQaLogo from '@/assets/img/logo/wps-mac-qa.svg';
import serviceQaLogo from '@/assets/img/logo/service-qa.svg';
import docerQaLogo from '@/assets/img/logo/docer-qa.svg';
import vipQaLogo from '@/assets/img/logo/vip-qa.svg';
import allQaLogo from '@/assets/img/logo/all-qa.svg';
export default {
  name: 'home-entry',
  data () {
    return {
      tagList: [
      {
        icon: msgQaLogo,
        text: '消息',
        tag_id: 'msg'
      },
      {
        icon: docQaLogo,
        text: '文档',
        tag_id: 'doc'
      },
      {
        icon: meetingQaLogo,
        text: '会议',
        tag_id: 'meeting'
      },
      {
        icon: calendarQaLogo,
        text: '日历',
        tag_id: 'calendar'
      },
      {
        icon: wpsQaLogo,
        text:'WPS Office',
        tag_id: 'wps'
      },
      {
        icon: macQaLogo,
        text:'WPS Mac',
        tag_id: 'mac'
      },
      {
        icon: serviceQaLogo,
        text:'账号、云、协作',
        tag_id: 'service'
      },
      {
        icon: vipQaLogo,
        text:'会员增值',
        tag_id: 'vip'
      },
      {
        icon: docerQaLogo,
        text:'稻壳',
        tag_id: 'docer'
      },
      {
        icon: allQaLogo,
        text: '全部问答',
        tag_id: 'all'
      }]
    }
  },
  components: {
    SearchBar,
    BgBox,
    OfficeNotice
  },
  methods: {
    jumpQa (tag_id) {
      this.$router.push({name: 'question-answer', params: {tag_id, CacheControl: 'no-store'}});
    }
  }
}
</script>

<style lang="scss" scoped>
@import './style';
</style>
