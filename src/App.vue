<script setup lang="ts">
import { onLaunch, onShow, onHide } from "@dcloudio/uni-app";
onLaunch(() => {
  // 全局隐藏系统默认导航栏
  uni.hideTabBar()
});
onShow(() => {
});
onHide(() => {
});
</script>
<style></style>
