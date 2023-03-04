<template>
  <svg viewBox="0 0 100 100">
    <g transform="translate(50,50)">
      <circle r="49" fill="#ccc5b9aa" />
      <path
        v-for="(item, index) in items"
        :key="index"
        :d="item.path"
        :fill="item.color"
        style="
           {
            transition: fill 0.5s;
          }
        "
      />
    </g>
  </svg>
</template>

<script setup lang="ts">
import { computed } from "vue";

interface PieChartItem {
  path: string;
  color: string;
}

interface PieChartProps {
  data: Array<{ value: number; color: string }>;
}

const props = defineProps<PieChartProps>();

const items = computed<PieChartItem[]>(() => {
  const total = props.data.reduce((acc, item) => acc + item.value, 0);
  let startAngle = 0;

  return props.data.map((item) => {
    const percentage = item.value / total;
    const endAngle = startAngle + percentage * 360;
    const data: PieChartItem = {
      path: getSlicePath(startAngle, endAngle),
      color: item.color,
    };
    startAngle = endAngle;
    return data;
  });
});

function getSlicePath(startAngle: number, endAngle: number): string {
  const radius = 50;
  const x1 = Math.cos((startAngle * Math.PI) / 180) * radius;
  const y1 = Math.sin((startAngle * Math.PI) / 180) * radius;
  const x2 = Math.cos((endAngle * Math.PI) / 180) * radius;
  const y2 = Math.sin((endAngle * Math.PI) / 180) * radius;
  const largeArcFlag = endAngle - startAngle <= 180 ? 0 : 1;
  const pathData = [
    `M 0 0`,
    `L ${x1} ${y1}`,
    `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
    `z`,
  ];
  return pathData.join(" ");
}
</script>
