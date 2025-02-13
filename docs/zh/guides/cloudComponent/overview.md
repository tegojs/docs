# 概述

# 介绍
云组件提供了可以自定义在平台上进行特定的组件开发和调试，无需进行平台构建等机制，用户可方便、快捷的针对特定业务或需求制定单独的组件及展示。

## 使用手册

添加组件
![](https://tachybase-1321007335.cos.ap-shanghai.myqcloud.com/522b5275defd17a44d6bed7d129f8c33.png)



 添加组件信息
![](https://tachybase-1321007335.cos.ap-shanghai.myqcloud.com/a188348598820f6f241b5197991f8020.png)



编辑组件信息
![](https://tachybase-1321007335.cos.ap-shanghai.myqcloud.com/f1d521640235b4c84006840615f9bc77.png)


组件相关
![](https://tachybase-1321007335.cos.ap-shanghai.myqcloud.com/eb52310bdc69e69ad146807653bd8446.png)

组件内也可导入其他包或组件进行使用
```
import { useForm } from '@tachybase/schema';
import { useNavigate } from 'react-router-dom';
```

可填写测试数据，在组件右侧预览信息
![](https://tachybase-1321007335.cos.ap-shanghai.myqcloud.com/a3ab50a3674851158af8ba87b51dc266.png)

示例
```
export default () => {
  const form = useForm();
  const data = form.values.data;

  return <Demo {...data}/>;
}
```

组件的信息、备注
![](https://tachybase-1321007335.cos.ap-shanghai.myqcloud.com/ad593bb66b45f43e90405952f4413680.png)
