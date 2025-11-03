# Extension Development

## Extend Frontend File Types

For uploaded files, different preview content can be displayed in the frontend interface based on different file types. The file manager's attachment field has built-in browser-based (embedded in iframe) file preview, which supports most file formats (images, videos, audio, and PDF, etc.) to be previewed directly in the browser. When the file format does not support browser preview, or when there are special preview interaction needs, you can implement it by extending preview components based on file types.

### Example

For example, if you want to extend a carousel switching component for image type files, you can use the following code:

```ts
import match from 'mime-match';
import { Plugin, attachmentFileTypes } from '@tachybase/client';

class MyPlugin extends Plugin {
  load() {
    attachmentFileTypes.add({
      match(file) {
        return match(file.mimetype, 'image/*');
      },
      Previewer({ index, list, onSwitchIndex }) {
        const onDownload = useCallback(
          (e) => {
            e.preventDefault();
            const file = list[index];
            saveAs(file.url, `${file.title}${file.extname}`);
          },
          [index, list],
        );
        return (
          <LightBox
            // discourageDownloads={true}
            mainSrc={list[index]?.url}
            nextSrc={list[(index + 1) % list.length]?.url}
            prevSrc={list[(index + list.length - 1) % list.length]?.url}
            onCloseRequest={() => onSwitchIndex(null)}
            onMovePrevRequest={() => onSwitchIndex((index + list.length - 1) % list.length)}
            onMoveNextRequest={() => onSwitchIndex((index + 1) % list.length)}
            imageTitle={list[index]?.title}
            toolbarButtons={[
              <button
                key={'preview-img'}
                style={{ fontSize: 22, background: 'none', lineHeight: 1 }}
                type="button"
                aria-label="Download"
                title="Download"
                className="ril-zoom-in ril__toolbarItemChild ril__builtinButton"
                onClick={onDownload}
              >
                <DownloadOutlined />
              </button>,
            ]}
          />
        );
      },
    });
  }
}
```

Where `attachmentFileTypes` is an entry object provided in the `@tachybase/client` package for extending file types. Use its `add` method to extend a file type description object.

Each file type must implement a `match()` method to check if the file type meets the requirements. In the example, the method provided by the `mime-match` package is used to detect the file's `mimetype` property. If it matches the `image/*` type, it is considered the file type to be processed. If the match is unsuccessful, it will fall back to the built-in type handling.

The `Previewer` property on the type description object is the component used for previewing. When the file type matches, this component will be rendered for preview. It is usually recommended to use a modal-type component as the base container (such as `<Modal />`, etc.), and then place the preview and interactive content inside that component to implement the preview functionality.

### API

```ts
export interface FileModel {
  id: number;
  filename: string;
  path: string;
  title: string;
  url: string;
  extname: string;
  size: number;
  mimetype: string;
}

export interface PreviewerProps {
  index: number;
  list: FileModel[];
  onSwitchIndex(index): void;
}

export interface AttachmentFileType {
  match(file: any): boolean;
  Previewer?: React.ComponentType<PreviewerProps>;
}

export class AttachmentFileTypes {
  add(type: AttachmentFileType): void;
}
```

#### `attachmentFileTypes`

`attachmentFileTypes` is a global instance, imported from `@tachybase/client`:

```ts
import { attachmentFileTypes } from '@tachybase/client';
```

#### `attachmentFileTypes.add()`

Register a new file type description object with the file type registry. The description object type is `AttachmentFileType`.

#### `AttachmentFileType`

##### `match()`

File format matching method.

The passed parameter `file` is the data object of the uploaded file, containing relevant properties that can be used for type determination:

* `mimetype`: mimetype description
* `extname`: file extension, including "."
* `path`: relative path where the file is stored
* `url`: file URL

The return value is of type `boolean`, indicating the result of whether it matches.

##### `Previewer`

A React component for previewing files.

The Props parameters passed in are:

* `index`: index of the file in the attachment list
* `list`: attachment list
* `onSwitchIndex`: method for switching the index

Where `onSwitchIndex` can be passed any index value in the list to switch to another file. If `null` is used as a parameter to switch, the preview component will be closed directly.

```ts
onSwitchIndex(null);
```
