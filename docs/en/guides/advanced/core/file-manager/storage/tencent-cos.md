# Tencent Cloud COS

Storage engine based on Tencent Cloud COS. Relevant accounts and permissions need to be prepared before use.

## Configuration Parameters

:::info{title=Note}
Only the dedicated parameters for the Tencent Cloud COS storage engine are introduced here. For common parameters, please refer to [Engine Common Parameters](./index.md#engine-common-parameters).
:::

### Region

Fill in the COS storage region, for example: `ap-chengdu`.

:::info{title=Note}
You can view the storage space region information in the [Tencent Cloud COS Console](https://console.cloud.tencent.com/cos), and only need to extract the region prefix part (full domain name not required).
:::

### SecretId

Fill in the ID of the Tencent Cloud authorized access key.

### SecretKey

Fill in the Secret of the Tencent Cloud authorized access key.

### Bucket

Fill in the bucket name of the COS storage, for example: `qing-cdn-1234189398`.
