import { Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import '../styles/ConcertCard.css';

const ConcertCard = (props) => {
    const { date, theater, description, name, id } = props.concert;
    return (
        <Card  className='concert-card generic-card d-flex'>
            <Card.Body>
                <Card.Title>{name}</Card.Title>
                <Card.Subtitle className="mb-2 text-muted">{date} at {theater}</Card.Subtitle>

                <Card.Text>
                    {description.substring(0, 20) + '...' || description}
                </Card.Text>
                <Link className='link-to-concert' to={`/concert/${id}`}>
                <Button variant="dark" className='mx-auto' style={{ position: 'absolute', bottom: '5px' }}>
                Go to &gt;&gt;
                </Button> </Link>
            </Card.Body>
        </Card>
    );
}

export default ConcertCard;