import { Button, Form, Input } from 'antd';
import cn from 'classnames';
import { memo } from 'react';

import type { Trip } from '@/core/types';

import styles from './index.module.less';
import { useCallback } from 'react';
import { updateTripInfo } from '@/core/biz';

export interface TripInfoEditorProps {
  className?: string;
  trip: Trip;
  onChange?: (trip: Trip) => void;
}

export const TripInfoEditor = memo<TripInfoEditorProps>(
  ({ className, trip, onChange }) => {
    const handleSave = useCallback(
      (changes: {
        title: string;
        description: string;
        departureDate: string;
      }) => {
        const changedTrip = updateTripInfo(changes, trip);
        if (onChange) {
          onChange(changedTrip);
        }
      },
      [onChange, trip],
    );
    return (
      <div className={cn(styles.container, className)}>
        <Form
          layout="vertical"
          initialValues={trip}
          autoComplete="off"
          onFinish={handleSave}
        >
          <section>
            <h3>基本信息</h3>
            <div className={styles.card}>
              <Form.Item
                label="标题"
                name="title"
                rules={[{ required: true, message: '标题不能为空' }]}
              >
                <Input size="large" placeholder="示例：川藏大环线" />
              </Form.Item>
              <Form.Item label="描述" name="description">
                <Input.TextArea
                  size="large"
                  placeholder="示例：6月1日出发，七天六晚，G318 进 G317 出"
                />
              </Form.Item>
              <Form.Item label="出发日期" name="departureDate">
                <Input size="large" type="date" />
              </Form.Item>
            </div>
          </section>
          <section>
            <Button
              block
              type="primary"
              size="large"
              shape="round"
              htmlType="submit"
            >
              保存更改
            </Button>
          </section>
        </Form>
      </div>
    );
  },
);
TripInfoEditor.displayName = 'TripInfoEditor';
