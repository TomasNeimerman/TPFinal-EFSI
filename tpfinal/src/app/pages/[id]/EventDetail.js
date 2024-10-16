import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useLogin } from './LoginContext';
import { useRouter } from 'next/navigation';

function EventDetail() {
  const { id } = useParams();
  const { token } = useLogin();
  const [event, setEvent] = useState(null);
  const [subscribed, setSubscribed] = useState(false);

  useEffect(() => {
    fetchEventDetails();
  }, [id]);
  


  const fetchEventDetails = async () => {
    try {
      const response = await fetch(`http://localhost:3508/api/event/${id}/?offset=1&limit=15`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setEvent(data);
    } catch (error) {
      console.error('Error fetching event details:', error);
    }
  };

  const handleSubscribe = async () => {
    if (!event || subscribed) return;

    try {
      const response = await fetch(`http://localhost:3508/api/event/${id}/subscribe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setSubscribed(true);
        // Optionally, update the event details to reflect the new subscription
        fetchEventDetails();
      }
    } catch (error) {
      console.error('Error subscribing to event:', error);
    }
  };
  console.log(id)
  const handleEventDetail = async => {
        
    router.push(`/${id}/EventDetail`);
  }

  if (!event) return <div>Loading...</div>;

  return (
    <div onClick={handleEventDetail}>
      <h1>{event.name}</h1>
      <p>{event.description}</p>
      <p>Date: {new Date(event.start_date).toLocaleString()}</p>
      <p>Duration: {event.duration_in_minutes} minutes</p>
      <p>Price: ${event.price}</p>
      <p>Location: {event.event_location.name}</p>
      <button onClick={handleSubscribe} disabled={subscribed}>
        {subscribed ? 'Subscribed' : 'Subscribe'}
      </button>
    </div>
  );
}

export default EventDetail;