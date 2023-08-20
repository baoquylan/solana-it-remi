import * as React from 'react';
import { message } from 'antd';

import { Form, Input, Button, InputNumber } from 'antd';
import { appStore } from '../store/App.store';

interface SwapFormProps {
  title: string;
  type: string;
  handleSwap:( number: number)=>void
}
const radio: number = 10;
export default function SwapForm({ title, type ,handleSwap}: SwapFormProps): JSX.Element {
  const { setIsLoading, isLoading } = appStore();
  const [form] = Form.useForm();

  const onSubmit = () => {
    form
      .validateFields()
      .then(async (values) => {
        handleSwap(values.token_1)
      })
      .catch((ex) => {
        message.error(ex);
        setIsLoading(false);
      });
  };

  const newValue = Form.useWatch('token_1', form);
  React.useEffect(() => {
    if(newValue){
        let parseToNumber: number = parseFloat(newValue)
        if (type !== 'MOVE') {
          form.setFieldValue('token_2', parseToNumber === 0 ? 0 : parseToNumber / radio);
        } else {
            form.setFieldValue('token_2',  parseToNumber * radio);
        }
    }
  
  }, [newValue]);
  return (
    <>
      <div className="lb-form-swap">
        <div className="header">
          <span>{title}</span>
        </div>
        <div className="body">
          <Form form={form} onFinish={onSubmit}>
            <Form.Item
              name="token_1"
              rules={[
                {
                  required: true,
                  message: `Please enter ${type !== 'SOL' ? 'SOL' : 'MOVE'}`
                },
              ]}
            >
              <InputNumber
                min={0}
                defaultValue={0}
                style={{
                  backgroundColor: 'transparent !important',
                  background: 'transparent',
                  width: '100%',
                }}
                placeholder={type !== 'SOL' ? 'SOL' : 'MOVE'}
              />
            </Form.Item>

            <Form.Item name="token_2">
              <InputNumber
                defaultValue={0}
                style={{
                  backgroundColor: 'transparent !important',
                  background: 'transparent',
                  width: '100%',
                }}
                placeholder={type === 'SOL' ? 'SOL' : 'MOVE'}
                disabled
              />
            </Form.Item>

            <Button htmlType="submit" type="primary" block loading={isLoading} >
              Exchange
            </Button>
          </Form>
        </div>
      </div>
    </>
  );
}
