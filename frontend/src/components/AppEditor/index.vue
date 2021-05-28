<template>
  <div class="editor" id="community-editor">
    <ul class="menu-list">
      <li :class="['menu-item', menuState.bold && 'active']" @click.stop="execCmdMiddle('bold')">
        <svg-icon name="iconeditor-bold"/>
      </li>
      <li :class="['menu-item', menuState.italic && 'active']" @click.stop="execCmdMiddle('italic')">
        <svg-icon name="iconeditor-italic"/>
      </li>
      <li :class="['menu-item', menuState.underline && 'active']" @click.stop="execCmdMiddle('underline')">
        <svg-icon name="iconeditor-underline"/>
      </li>
      <li class="menu-item" @click="addSplitLine">
        <svg-icon name="iconeditor-splitline"/>
      </li>
      <li class="menu-item" @click="switchDialog()">
        <svg-icon name="iconeditor-hyperlink"/>
      </li>
      <li class="menu-item">
        <input
          ref="img-input"
          class="img-input"
          type="file"
          accept=".jpg,.png,.gif,.webp"
          @change="uploadImg"/>
        <svg-icon class="img-icon" name="iconeditor-img"/>
      </li>
    </ul>
    <div class="editor-content-wrapper" id="editor-wrapper">
      <div ref="editor-content"
        id="editor-content"
        class="editor-content"
        contenteditable="true"
        @input="emitRichText()"
        @blur="storeRangeInfo()"
        @focus="setRangeInfo()"
        @mouseup="checkMenuState()"></div>
    </div>
    <el-dialog
      title="添加链接"
      width="450px"
      :visible.sync="isShowAddLink">
      <div class="dialog-content">
        <span class="link-desc">链接地址</span>
        <input class="link-input" v-model="hyperLink"/>
      </div>
      <div class="dialog-footer" slot="footer">
        <button class="btn btn-cancel" @click="switchDialog()">取消</button>
        <button class="btn btn-submit" @click="addHyperLink()">确定</button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      isShowAddLink: false,
      hyperLink: '',
      menuState: {
        bold: false,
        italic: false,
        underline: false
      },
      storeRange: null,
      // 每次执行的命令
      execCmdTick: {
        bold: false,
        italic: false,
        underline: false
      },
      saveScrollY: 0,
      cur_cmd: ''
    }
  },
  mounted () {
    // 设置段落分隔符
    document.execCommand("defaultParagraphSeparator", false, "p");
  },
  computed: {
    needHandleScroll () {
      const cmds = [
        'bold',
        'italic',
        'underline',
        'addSplitLink',
        'createLink',
        'insertHTML'
      ];
      return cmds.indexOf(this.cur_cmd) > -1;
    }
  },
  methods: {
    clearEditorCmds () {
      Object.keys(this.menuState).forEach(cmd => {
        if (this.menuState[cmd]) {
          this.execEditorCommand(cmd);
          this.switchMenuState(cmd);
        }
      });
    },
    uploadImg () {
      let self = this;
      const imgFile = event.target.files[0];
      if (imgFile.size / 1024 > 10 * 1024) {
        this.$notify({
          title: '上传的图片最大为10MB',
          type: 'warning'
        });
        return;
      }
      const fr = new FileReader();
      fr.readAsDataURL(imgFile);
      fr.onload = async function () {
        const fileBase64 = event.target.result;
        const params = {
          data: fileBase64
        };
        const res = await self.$store.dispatch('Image/uploadImg', params);
        if (res && res.result === 'ok') {
          const imgStr = `<img style="max-width: 100%;" src="${res.url}"/>`;
          self.execEditorCommand('insertHTML', imgStr);
          self.emitRichText();
        }
        self.$refs['img-input'].value = '';
      }
    },
    initEditorContent (html) {
      this.$refs['editor-content'].innerHTML = html;
      // manual emit for update editor value when initial value
      this.emitRichText();
    },
    switchMenuState (command) {
      this.$set(this.menuState, command, !this.menuState[command]);
    },
    execCmdMiddle (command) {
      this.cur_cmd = command;
      this.$set(this.execCmdTick, command, !this.execCmdTick[command]);
      this.switchMenuState(command);
      Object.keys(this.execCmdTick).forEach(cmd => {
        if (this.execCmdTick[cmd]) this.execEditorCommand(cmd);
      });
    },
    execEditorCommand (command, arg = null) {
      if (command === 'insertHTML') this.clearEditorCmds();
      this.needHandleScroll && (this.saveScrollY = this.$refs['editor-content'].scrollTop);
      this.focusEditor();
      document.execCommand(command, false, arg);
      this.needHandleScroll && this.handleScrollPosition();
    },
    storeRangeInfo () {
      const selection = window.getSelection();
      if (selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        this.storeRange = {
          collapsed: range.collapsed,
          startOffset: range.startOffset,
          endOffset: range.endOffset,
          startContainer: range.startContainer,
          endContainer: range.endContainer
        };
      } else {
        // focus editor when none range count and store against
        this.focusEditor();
        this.storeRangeInfo();
      }
    },
    setRangeInfo () {
      if (this.storeRange) {
        const range = window.getSelection().getRangeAt(0);
        range.setStart(this.storeRange.startContainer, this.storeRange.startOffset);
        range.setEnd(this.storeRange.endContainer, this.storeRange.endOffset);
      }
    },
    switchDialog () {
      // store range position before open dialog
      if (!this.isShowAddLink) {
        this.focusEditor();
        this.storeRangeInfo();
        this.handleScrollPosition();
        this.clearHyperLink();
        let textParentNode = this.storeRange.endContainer.parentNode;
        if (!this.storeRange.collapsed && textParentNode.nodeType === 1 && textParentNode.nodeName === 'A') {
          this.hyperLink = textParentNode.href;
        }
      }
      this.isShowAddLink = !this.isShowAddLink;
    },
    addLinkAttr() {
      const editorContent = document.querySelector('.editor-content')
      const aTags = editorContent.querySelectorAll('a');
      aTags.forEach(aTag => {
        aTag.setAttribute('style', 'border-bottom: 2px solid #d1e9ff');
        aTag.target = '_brank';
        this.checkLink(aTag);
      });
    },
    checkLink (aTag) {
      const curHref = aTag.getAttribute('href');
      if(!/^(http:\/\/)|(https:\/\/)|(\/\/)/.test(curHref)) {
        aTag.setAttribute('href', `//${curHref}`);
      }
    },
    clearHyperLink () {
      this.hyperLink = '';
    },
    addHyperLink () {
      this.switchDialog();
      this.setRangeInfo();
      this.execEditorCommand('createLink', this.hyperLink);
      this.clearHyperLink();
      this.emitRichText();
    },
    checkParentNode (node) {
      if (!node || node.id === 'editor-wrapper' || node.id === 'editor-content') {
        return;
      }
      const nodeName = node.nodeName;
      switch(nodeName) {
        case 'U':
          this.menuState.underline = true;
          node.style.fontWeight === 'bold' && (this.menuState.bold = true);
          node.style.fontStyle === 'italic' && (this.menuState.italic = true);
        break;
        case 'I':
          this.menuState.italic = true;
          node.style.fontWeight === 'bold' && (this.menuState.bold = true);
          node.style.textDecorationLine === 'underline' && (this.menuState.underline = true);
        break;
        case 'B':
          this.menuState.bold = true;
          node.style.fontStyle === 'italic' && (this.menuState.italic = true);
          node.style.textDecorationLine === 'underline' && (this.menuState.underline = true);
        break;
      }
      this.checkParentNode(node.parentNode);
    },
    checkMenuState () {
      this.menuState = {
        bold: false,
        italic: false,
        underline: false
      };
      const rangeDom = document.getSelection().getRangeAt(0);
      if (rangeDom.startContainer === rangeDom.endContainer) {
        const node = rangeDom.endContainer;
        this.checkParentNode(node);
      }
    },
    /**
    * 添加分割线
    */
    addSplitLine () {
      this.cur_cmd = 'addSplitLink';
      const elementStr = '<br><div style="width: 240px; border-top: 1px solid #d3d3d3; margin: 60px auto;"></div><br>';
      this.execEditorCommand('insertHTML', elementStr);
      this.handleScrollPosition();
    },
    emitRichText () {
      this.checkMenuState();
      // clear commands
      this.execCmdTick = {
        bold: false,
        italic: false,
        underline: false
      };
      // add link attributes
      this.addLinkAttr();
      let richTextVal = this.$refs['editor-content'].innerHTML;
      if (richTextVal === '<p><br></p>' || richTextVal === '<br>') {
        richTextVal = '';
      }
      this.$emit('updateEditorVal', richTextVal);
    },
    /**
    * fix bug scroll to top when click menu
    * reset scroll position
    */
    handleScrollPosition() {
      let editorContent = this.$refs['editor-content'];
      editorContent.scrollTop = this.saveScrollY;
    },
    focusEditor () {
      this.$refs['editor-content'].focus();
    },
    clearEditorVal () {
      this.$refs['editor-content'].innerHTML = '';
    }
  }
}
</script>

<style lang="scss" scoped>
@import './style';
</style>