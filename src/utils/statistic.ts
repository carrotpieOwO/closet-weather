import { EChartOption } from "echarts";
import { ClothItem } from "../index.d";
import { groupBy } from "lodash";
import { findParentLabel } from "../utils/category";

interface PieProps {
    name: string,
    value: number
}
const createPieOption = (data:PieProps[], title:string) => {
    const pieOption:EChartOption = {
        title: {
            text: title,
            left: 'center'
        },
          tooltip: {
            trigger: 'item',
          },
          series: [
            {
              type: 'pie',
              radius: '50%',
              data: data,
              emphasis: {
                itemStyle: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
              }
            }
        ]
    }
    return pieOption
}
type BarProps = (string | number)[][]
const createBarOption = (data:BarProps) => {
  const barOption:EChartOption = {
    dataset: {
      source: data
    },
    legend: {},
    tooltip: {},
    xAxis: { 
      type: 'category', 
      axisLabel: {
          rotate: 30,
          interval: 0
          }
    },
    yAxis: {},
    series: [{ type: 'bar' }, { type: 'bar' }, { type: 'bar' }]
  }
  return barOption;
}
const countByGroup = (grouppedData: Record<string, ClothItem[]>) => {
    const keys = Object.keys(grouppedData);
    const countedData = keys.map(data => ({
        value: grouppedData[data].length,
        name: data,
    }));

    return countedData
}
interface CategoryCountArr {
  name: string,
  count: number,
  percent: number
}
export const statistic = (documents:ClothItem[]) => {
    // 착용횟수가 가장 높은 순위, 낮은 순위 구하기
    const clothWearRank = documents.sort((a, b) => (b.wearCount || 0) - (a.wearCount || 0));
    const bestCloth = clothWearRank.slice(0, 3);
    const worstCloth = clothWearRank.slice(clothWearRank.length -3, clothWearRank.length);
    const bestWorstCloth = { bestCloth, worstCloth}

    // 카테고리별로 나눔
    const groupedByCategory = groupBy(documents, 'category')
    const subCategoryCounts  = countByGroup(groupedByCategory)
    // 카테고리별 개수산정 파이차트 옵션 생성
    const categoryPieOption:EChartOption = createPieOption(subCategoryCounts, '카테고리별 비중')
    
    // 상위 카테고리별 개수 산정
    const categoryCounts: Record<string, { count: number, percent: number }> = {
      "outer": { count: 0, percent: 0 },
      "top": { count: 0, percent: 0 },
      "bottom": { count: 0, percent: 0 },
    };
    for (const category in groupedByCategory) {
        const parentCategory = findParentLabel(category);
        const count = groupedByCategory[category].length || 0;
        const percent = Math.round(count / documents.length * 100);

        categoryCounts[parentCategory] = { 
          count: (categoryCounts[parentCategory]?.count || 0) + count, 
          percent: (categoryCounts[parentCategory]?.percent || 0) + percent
        }
    }

    const categoryCountsArr :CategoryCountArr[] = Object.entries(categoryCounts).map(([name, { count, percent }]) => ({
      name,
      count,
      percent,
    }));

    // 화면에 보여줄 순서대로 정렬
    const order = ["outer", "top", "bottom"];
    categoryCountsArr.sort((a, b) => order.indexOf(a.name) - order.indexOf(b.name));

    // 브랜드별로 나눔
    const groupedByBrand = groupBy(documents, 'brand')
    const brandCounts  = countByGroup(groupedByBrand)
    // 브랜드별 개수산정 파이차트 옵션 생성
    const brandPieOption:EChartOption = createPieOption(brandCounts, '브랜드별 비중')

    // 브랜드별, 카테고리별 wearcount 산정
    const brandCategoryCount = Object.keys(groupedByBrand).map((brand) => {
      const brandDocs = groupedByBrand[brand];
      const brandCount: number[] = [0, 0, 0]; // outer, top, bottom
    
      brandDocs.forEach((doc) => {
        // outer, top, bottom의 상위카테고리별로 분류해주기 위해 category의 상위카테고리명을 받아온다.
        const category = findParentLabel(doc.category!);
    
        if (category === 'outer') {
          brandCount[0] += doc.wearCount || 0;
          } else if (category === 'top') {
            brandCount[1] += doc.wearCount || 0;
          } else if (category === 'bottom') {
            brandCount[2] += doc.wearCount || 0;
          }
        });
    
      return [brand === '' ? '기타' : brand, ...brandCount];
    });

    // 브랜드별, 카테고리별 착용횟수 bar차트 생성
    brandCategoryCount.unshift(['brand', 'outer', 'top', 'bottom'])
    const barOption = createBarOption(brandCategoryCount)
    
    return { categoryCountsArr, categoryPieOption, brandPieOption, barOption, bestWorstCloth }
}