import {
  SchemaComponent,
  SchemaComponentProvider,
  useDesignable,
} from "@tachybase/client";
import React from "react";

const Hello = () => <h1>Hello, world!</h1>;

const Page = ({ children }: { children: React.ReactElement }) => {
  const dn = useDesignable();
  return (
    <div>
      <button
        onClick={() => {
          dn.insertAfterBegin({
            type: "void",
            "x-component": "Hello",
          });
        }}
      >
        点此新增子节点
      </button>
      {children}
    </div>
  );
};

const schema = {
  type: "void",
  name: "page",
  "x-component": "Page",
};

export const DesignerDemo1 = () => {
  return (
    <SchemaComponentProvider components={{ Page, Hello }}>
      <SchemaComponent schema={schema} />
    </SchemaComponentProvider>
  );
};
