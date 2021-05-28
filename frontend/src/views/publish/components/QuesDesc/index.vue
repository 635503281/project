<template>
  <div class="ques-desc">
    <div class="desc-content">
      <h1 class="sug-title">标题建议</h1>
      <ul class="sug-list">
        <li class="sug-item" v-for="(item, index) in sug_data" :key="index">
          <h2 class="item-text">{{item.title}}</h2>
          <ul class="sub-list" v-if="item.examples">
            <li class="sub-item" v-for="(el, idx) in item.examples" :key="idx">
              <svg-icon class="icon" :name="el.type === 'wrong' ? 'iconerror-icon' : 'iconright-icon'"/>
              <p class="text">{{el.text}}</p>
            </li>
          </ul>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import SvgIcon from '@/components/SvgIcon';
export default {
  components: {
    SvgIcon
  }
}
</script>

<script>
export default {
  data () {
    return {
      sug_data: [
        {
          title: '保持中立，表达清晰，客观陈述',
          examples: [{
            type: 'wrong',
            text: '这个设计太糟糕了，非常差',
          },
          {
            type: 'right',
            text: '阻塞时对话框的弹出会导致用户操作被干扰，建议优化'
          }]
        },
        {
          title: '包含关键信息，言简易赅，信息有效',
          examples: [{
            type: 'wrong',
            text: '好像出bug了，登不上',
          },
          {
            type: 'right',
            text: 'PC Office登录时，网络正常下不能正常登陆'
          }]
        },
        {
          title: '详细信息，建议在问题描述中阐述'
        }
      ]
    }
  }
}
</script>

<style lang="scss" scoped>
@import './style.scss';
</style>
