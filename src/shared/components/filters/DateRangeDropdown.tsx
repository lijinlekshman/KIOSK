import React, { useCallback } from 'react';
import { Col, Form } from 'react-bootstrap';
import { DateRange, useFilters } from '@shared/contexts/FiltersContext';

const DateRangeDropdown: React.FC<{
  colProps?: { xs?: number; sm?: number; md?: number; lg?: number };
}> = ({ colProps = { xs: 12, sm: 6, md: 6 } }) => {
  const { dateRange, setDateRange } = useFilters();

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLSelectElement>) => {
      setDateRange(event.target.value as DateRange);
    },
    [setDateRange]
  );

  return (
    <Col {...colProps}>
      <Form.Group controlId='dateRangeSelect'>
        <Form.Select
          value={dateRange}
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
