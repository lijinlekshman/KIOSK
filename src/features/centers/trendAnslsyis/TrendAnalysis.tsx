import React from 'react';
import { Line } from 'react-chartjs-2';
import { Card, Row, Col } from 'react-bootstrap';
import '../Centers.scss';
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend,
  Title
} from 'chart.js';

ChartJS.register(
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend,
  Title
);

const lineChartData = {
  labels: [
    '8:00',
    '9:00',
    '10:00',
    '11:00',
    '12:00',
    '13:00',
    '14:00',
    '15:00',
    '16:00',
    '17:00',
    '18:00',
    '19:00',
    '20:00',
    '21:00'
  ],
  datasets: [
    {
      label: 'Users',
      data: [
        500, 900, 3000, 2500, 4000, 2000, 4500, 3000, 5000, 3500, 6000, 8000,
        4000, 2000
      ],
      fill: false,
      borderColor: '#00AEEF',
      tension: 0.4,
      pointRadius: 4,
      pointBackgroundColor: '#00AEEF'
    }
  ]
};

const lineChartOptions = {
  responsive: true,
  plugins: {
    legend: { display: false }
  },
  scales: {
    y: { beginAtZero: true }
  }
};

const TrendAnalysis: React.FC = () => (
  <section className='mt-4 Anaysis-Widget'>
    <h5 className='mb-3'>Trend Analysis</h5>
    <Row>
      <Col lg={9} xs={12} className='bg-white p-3 border-radius'>
        <Row className='mb-3 g-3'>
          <Col md={3} xs={6}>
            <Card className='text-center'>
              <Card.Body>
                <div className='fw-bold fs-4'>1028</div>
                <div className='text-muted small'>Kiosk Check-ins</div>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3} xs={6}>
            <Card className='text-center'>
              <Card.Body>
                <div className='fw-bold fs-4'>31 mins</div>
                <div className='text-muted small'>Average Check-in Time</div>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3} xs={6}>
            <Card className='text-center'>
              <Card.Body>
                <div className='fw-bold fs-4'>1452</div>
                <div className='text-muted small'>New Appointments</div>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3} xs={6}>
            <Card className='text-center'>
              <Card.Body>
                <div className='fw-bold fs-4'>2.1 sec</div>
                <div className='text-muted small'>API Response Time</div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
        <Card>
          <Card.Body>
            <Line
              data={lineChartData}
              options={lineChartOptions}
              height={500}
            />
          </Card.Body>
        </Card>
      </Col>
      <Col lg={3} xs={12} className='mt-3 mt-lg-0'>
        <Card className='mb-3'>
          <Card.Body>
            <div className='fw-semibold mb-2'>Customer Feedback</div>
            <img
              src='https://dummyimage.com/220x80/eeeeee/00aaff&text=Feedback+Bar+Chart'
              alt='Customer Feedback'
              className='img-fluid'
            />
            <div className='d-flex justify-content-between mt-2 small'>
              <span className='text-success'>Happy</span>
              <span className='text-warning'>Neutral</span>
              <span className='text-danger'>Sad</span>
            </div>
          </Card.Body>
        </Card>
        <Card className='mb-3'>
          <Card.Body>
            <div className='fw-semibold mb-2'>Device Uptime</div>
            <div className='fs-4 fw-bold'>99%</div>
            <div className='text-muted small'>Avg. Daily Kiosk uptime</div>
          </Card.Body>
        </Card>
        <Card>
          <Card.Body>
            <div className='fw-semibold mb-2'>Demographics</div>
            <img
              src='https://dummyimage.com/220x120/eeeeee/00aaff&text=Pie+Chart'
              alt='Demographics'
              className='img-fluid'
            />
            <div className='d-flex justify-content-between mt-2 small'>
              <span className='text-primary'>Male 1830</span>
              <span className='text-danger'>Female 700</span>
            </div>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  </section>
);

export default TrendAnalysis;
