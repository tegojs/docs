# Overview

# Introduction
Cloud components provide the ability to customize and develop specific components on the platform for debugging, without the need for platform building. Users can conveniently and quickly create separate components and displays for specific business requirements or needs.

## User Manual

Add Component
![](https://tachybase-1321007335.cos.ap-shanghai.myqcloud.com/522b5275defd17a44d6bed7d129f8c33.png)



Add Component Information
![](https://tachybase-1321007335.cos.ap-shanghai.myqcloud.com/a188348598820f6f241b5197991f8020.png)



Edit Component Information
![](https://tachybase-1321007335.cos.ap-shanghai.myqcloud.com/f1d521640235b4c84006840615f9bc77.png)


Component Related
![](https://tachybase-1321007335.cos.ap-shanghai.myqcloud.com/eb52310bdc69e69ad146807653bd8446.png)

Components can also import other packages or components for use
```
import { useForm } from '@tachybase/schema';
import { useNavigate } from 'react-router-dom';
```

You can fill in test data and preview information on the right side of the component
![](https://tachybase-1321007335.cos.ap-shanghai.myqcloud.com/a3ab50a3674851158af8ba87b51dc266.png)

Example
```
export default () => {
  const form = useForm();
  const data = form.values.data;

  return <Demo {...data}/>;
}
```

Component Information and Notes
![](https://tachybase-1321007335.cos.ap-shanghai.myqcloud.com/ad593bb66b45f43e90405952f4413680.png)
