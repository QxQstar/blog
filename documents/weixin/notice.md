> 这个文件中记录微信小程序开发遇到的一些坑
1. 使用image标签要注意指定mode属性，不要依赖微信小程序的默认值（scaleToFill）。
> 图片的尺寸为100px * 100px，给image的样式设置为40px * 40px，mode为scaleToFill，图片还是可能会变形