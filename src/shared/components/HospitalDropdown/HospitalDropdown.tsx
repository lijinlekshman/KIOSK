import React, { useCallback } from 'react';
// import { Form, Row, Col } from 'react-bootstrap';
import { Form, Col } from 'react-bootstrap';

export type HospitalOption =
  | 'All'
  | 'Mediclinic Creek Harbour'
  | 'Mediclinic Welcare'
  | 'Mediclinic Dubai Hills'
  | 'Mediclinic Deira';

interface HospitalDropdownProps {
  value: HospitalOption;
  onChange: (hospital: HospitalOption) => void;
  label?: string;
  className?: string;
  colProps?: {
    xs?: number;
    sm?: number;
    md?: number;
    lg?: number;
  };
}

const HospitalDropdown: React.FC<HospitalDropdownProps> = ({
  value,
  onChange,
  label = 'Hospital',
  className = '',
  colProps = { xs: 12, sm: 6, md: 4 }
}) => {
  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLSelectElement>) => {
      onChange(event.target.value as HospitalOption);
    },
    [onChange]
  );

  return (
    <Col {...colProps} className={className}>
      <Form.Group controlId='hospitalSelect'>
        <Form.Label className='fw-semibold mb-2'>{label}</Form.Label>
        <Form.Select
          value={value}
          onChange={handleChange}
          className='hospital-select'
        >
          <option value='All'>All</option>
          <option value='Mediclinic Creek Harbour'>
            Mediclinic Creek Harbour
          </option>
          <option value='Mediclinic Welcare'>Mediclinic Welcare</option>
          <option value='Mediclinic Dubai Hills'>Mediclinic Dubai Hills</option>
          <option value='Mediclinic Deira'>Mediclinic Deira</option>
        </Form.Select>
      </Form.Group>
    </Col>
  );
};

export default HospitalDropdown;
