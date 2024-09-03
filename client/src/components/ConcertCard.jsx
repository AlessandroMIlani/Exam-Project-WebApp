import { Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';




const ConcertCard = (props) => {
    const { date, theater, description, name, id } = props.concert;


    return (

        <Card style={{ height: '12rem' }}>
            <Card.Body>
                <Card.Title>{name}</Card.Title>
                <Card.Subtitle className="mb-2 text-muted">{date} at {theater}</Card.Subtitle>

                <Card.Text>
                    {description.substring(0, 20) + '...' || description}
                </Card.Text>
                <Button variant="dark" className='mx-auto' style={{ position: 'absolute', bottom: '5px' }}>
                    <Link style={{ color: '#fff', textDecoration: 'none' }} to={`/concert/${id}`}>Go to &gt;&gt;</Link>
                </Button>
            </Card.Body>
        </Card>
    );
}

export default ConcertCard;