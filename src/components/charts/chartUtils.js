const baseColorPalette = [
    "#4e79a7", "#f28e2b", "#e15759", "#76b7b2", "#59a14f",
    "#edc949", "#af7aa1", "#ff9da7", "#9c755f", "#bab0ac",
  ];
  
  const generateColor = (index) => `hsl(${index * 30}, 70%, 50%)`;
  
  const getTextWidth = (text, font = "16px Arial") => {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    context.font = font;
    return context.measureText(text).width;
  };
  
  export const formatHorizontalBarData = (data) => {
    const formattedData = data.map((d, i) => ({
      id: d.text,
      label: d.text,
      value: d.count,
      color: data.length > baseColorPalette.length ? generateColor(i) : baseColorPalette[i],
    }));
    const longestLabelWidth = Math.max(...formattedData.map((d) => getTextWidth(d.id)));
    return { formattedData, leftMargin: longestLabelWidth + 20 };
  };

  export const formatGroupedBarData = (groupedData) => {
  const keys = Object.keys(groupedData[0].values);
  const formattedData = groupedData.map((item, i) => {
    const entry = { group: item.group };
    keys.forEach((key, idx) => {
      entry[key] = item.values[key];
    });
    entry.color = baseColorPalette[i % baseColorPalette.length];
    return entry;
  });
  return { formattedData, keys };
};
  
  export const formatStackedBarData = (optional) => {
    const keys = Object.keys(optional[0].options);
    const totalValues = optional.map((o) => Object.values(o.options).reduce((sum, val) => sum + val, 0));
    const stackedData = optional.map((o, i) => {
      const obj = { category: o.text };
      keys.forEach((key) => {
        obj[key] = (o.options[key] / totalValues[i]) * 100;
      });
      return obj;
    });
    return { stackedData, keys };
  };
  
  export const formatDonutData = (data) => {
    const total = data.reduce((sum, d) => sum + d.count, 0);
    return data.map((d, i) => ({
      id: d.text,
      label: d.text,
      value: ((d.count / total) * 100).toFixed(2),
      color: data.length > baseColorPalette.length ? generateColor(i) : baseColorPalette[i],
    }));
  };
  