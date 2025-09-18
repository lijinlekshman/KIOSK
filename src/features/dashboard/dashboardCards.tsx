import React from 'react';
import { Row, Col, Card } from 'react-bootstrap';

export type DashboardMetricTone =
  | 'neutral'
  | 'positive'
  | 'negative'
  | 'warning';

export type DashboardMetricItem = {
  id: string;
  title: string;
  value: string | number;
  subText?: string;
  tone?: DashboardMetricTone;
  colProps?: {
    xs?: number;
    sm?: number;
    lg?: number;
    xxl?: number;
  };
};

export const DashboardCard: React.FC<DashboardMetricItem> = ({
  id,
  title,
  value,
  subText,
  tone = 'neutral'
}) => {
  return (
    <Col key={id} className='d-flex dashboard-card-single'>
      <Card className='flex-fill metric-card'>
        <Card.Body>
          <div className='metric-title'>{title}</div>
          <div className='metric-value'>{value}</div>
          {subText && (
            <div className={`metric-sub ${tone}`}>
              {(() => {
                const firstSpaceIndex = subText.indexOf(' ');
                if (firstSpaceIndex === -1) {
                  return (
                    <span className='metric-sub-value'>
                      {id === 'total-kiosks' && (
                        <span className='icon user-icon' aria-hidden='true' />
                      )}
                      {subText}
                      {id === 'total-kiosks' && (
                        <span
                          className={`tone-icon ${tone}`}
                          aria-hidden='true'
                        />
                      )}
                    </span>
                  );
                }
                const numericPart = subText.slice(0, firstSpaceIndex);
                const textPart = subText.slice(firstSpaceIndex + 1);
                return (
                  <>
                    <span className='metric-sub-value'>
                      {id === 'total-kiosks' && (
                        <span className='icon user-icon' aria-hidden='true' />
                      )}
                      {numericPart}
                      {/* {id === 'total-kiosks' && (
                        <span
                          className={`tone-icon ${tone}`}
                          aria-hidden='true'
                        />
                      )} */}
                    </span>
                    <span className='metric-sub-label'>{textPart}</span>
                  </>
                );
              })()}
            </div>
          )}
        </Card.Body>
      </Card>
    </Col>
  );
};

const DashboardCards: React.FC<{ children: React.ReactNode }> = ({
  children
}) => {
  return (
    // <Row className='g-3 row-cols-1 row-cols-sm-2 row-cols-lg-5'>{children}</Row>
    <Row>{children}</Row>
  );
};

export default DashboardCards;
