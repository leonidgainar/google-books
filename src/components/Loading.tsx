import React from 'react';
import { Row, Col, Spin } from 'antd';

const Loading: React.FC = () => (
  <Row>
    <Col>
      <Spin tip="Loading..." size="large" fullscreen>
        <div className="content" />
      </Spin>
    </Col>
  </Row>
);

export default Loading;
