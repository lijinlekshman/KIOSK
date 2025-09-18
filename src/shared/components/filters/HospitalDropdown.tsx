import React, { useCallback } from 'react';
import { Col, Form } from 'react-bootstrap';
import { HospitalOption, useFilters } from '@shared/contexts/FiltersContext';

const HospitalDropdown: React.FC<{
  colProps?: { xs?: number; sm?: number; md?: number; lg?: number };
}> = ({ colProps = { xs: 12, sm: 6, md: 6 } }) => {
  const { hospital, setHospital, hospitalOptions } = useFilters();

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLSelectElement>) => {
      setHospital(event.target.value as HospitalOption);
    },
    [setHospital]
  );

  return (
    <Col {...colProps}>
      <Form.Group controlId='hospitalSelect'>
        {/* <Form.Label className='fw-semibold mb-2'>Hospital</Form.Label> */}
        <Form.Select
          value={hospital}
          onChange={handleChange}
          className='hospital-select'
        >
          {hospitalOptions.map(opt => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </Form.Select>
      </Form.Group>
    </Col>
  );
};

export default HospitalDropdown;
