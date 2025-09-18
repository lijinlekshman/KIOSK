import React, { useCallback } from 'react';
// import { Form, Row, Col } from 'react-bootstrap';
import { Form, Col } from 'react-bootstrap';

export type DateRange = 'today' | 'last7days' | 'last30days';

interface DateRangeDropdownProps {
  value: DateRange;
  onChange: (range: DateRange) => void;
  label?: string;
  className?: string;
  colProps?: {
    xs?: number;
    sm?: number;
    md?: number;
    lg?: number;
  };
}

const DateRangeDropdown: React.FC<DateRangeDropdownProps> = ({
  value,
  onChange,
  label = 'Date Range',
  className = '',
  colProps = { xs: 12, sm: 6, md: 4 }
}) => {
  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLSelectElement>) => {
      onChange(event.target.value as DateRange);
    },
    [onChange]
  );

  return (
    <Col {...colProps} className={className}>
      <Form.Group controlId='dateRangeSelect'>
        <Form.Label className='fw-semibold mb-2'>{label}</Form.Label>
        <Form.Select
          value={value}
          onChange={handleChange}
          className='date-range-select'
        >
          <option value='today'>Today</option>
          <option value='last7days'>Last 7 Days</option>
          <option value='last30days'>Last 30 Days</option>
        </Form.Select>
      </Form.Group>
    </Col>
  );
};

export default DateRangeDropdown;
