import React, { useEffect, useState } from 'react';
import { Button, Card, Col, Row, Select, Table } from 'antd';
import { CoffeeOutlined, QuestionOutlined } from '@ant-design/icons';
import { useParams, useLocation } from 'react-router-dom';
import io from 'socket.io-client';
import './Voting.css';

const { Option } = Select;
const socket = io.connect('http://localhost:4000');

const Voting = () => {
  const { id } = useParams();
  const location = useLocation();
  const { username } = location.state || {};
  const [selectedOption, setSelectedOption] = useState(null);
  const [cardValues, setCardValues] = useState([1, 2, 3, 4, 5, 6, 7, 8, '?', '☕']);
  const [voters, setVoters] = useState([]);
  const [isModerator, setIsModerator] = useState(false);
  const [votesVisible, setVotesVisible] = useState(false);

  useEffect(() => {
    socket.emit("join_session", { sessionid: id, username });

    socket.on("voters", (data) => {
      setVoters(data);
      const currentUser = data.find(voter => voter.user_name === username);
      if (currentUser) {
        setIsModerator(currentUser.is_moderator);
        setVotesVisible(currentUser.votes_visible);
      }
    });

    socket.on("vote_update", (data) => {
      setVoters(data);
    });

    socket.on("toggle_votes", (visibility) => {
      setVotesVisible(visibility);
    });

    return () => {
      socket.off("voters");
      socket.off("vote_update");
      socket.off("toggle_votes");
    };
  }, [id, username]);

  const handleCardClick = (option) => {
    setSelectedOption(option);
    socket.emit("submit_vote", { sessionid: id, username, vote: option });
  };

  const handleDropdownChange = (value) => {
    switch (value) {
      case 'fibonacci':
        setCardValues([0, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, '?', '☕']);
        break;
      case 'modifiedFibonacci':
        setCardValues([0, '½', 1, 2, 3, 5, 8, 13, 20, 40, 100, '?', '☕']);
        break;
      case 'tshirts':
        setCardValues(['XS', 'S', 'M', 'L', 'XL', '?', '☕']);
        break;
      case 'powersOf2':
        setCardValues([0, 1, 2, 4, 8, 16, 32, 64, '?', '☕']);
        break;
      default:
        setCardValues([1, 2, 3, 4, 5, 6, 7, 8, '?', '☕']);
    }
  };

  const toggleVoteVisibility = async () => {
    try {
        const response = await fetch('http://localhost:4000/toggle_votes_visibility', { 
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ sessionid: id }),
        });

        if (response.ok) {
            console.log('Vote visibility toggled');
        } else {
            console.error('Failed to toggle vote visibility');
        }
    } catch (error) {
        console.error('Error:', error);
    }
};


  const columns = [
    {
      title: 'Name',
      dataIndex: 'user_name',
      key: 'user_name',
    },
    {
      title: 'Vote',
      dataIndex: 'vote',
      key: 'vote',
      render: (text) => (votesVisible ? text : 'Hidden'),
    },
  ];

  const dataSource = voters.map((voter, index) => ({
    key: index,
    user_name: voter.user_name,
    vote: voter.vote || 'N/A',
  }));

  return (
    <div className='container'>
      <div className='link-display'>
        <h3>Voting Session ID: {id}</h3>
      </div>
      <div className='part1'>
        <div className='Section-1'>
          <Row gutter={16} className='row' justify='start'>
            {cardValues.map((value, index) => (
              <Col span={4} key={index}>
                <Card
                  bordered={false}
                  className={`cards ${selectedOption === value ? 'selected' : ''}`}
                  onClick={() => handleCardClick(value)}
                >
                  {value === '☕' ? <CoffeeOutlined /> : value === '?' ? <QuestionOutlined /> : value}
                </Card>
              </Col>
            ))}
          </Row>
        </div>
        {isModerator && (
          <div className='Section-2'>
            <Card title='Story Points' bordered={false}>
              <Select placeholder='Select an option' onChange={handleDropdownChange} style={{ width: '100%' }}>
                <Option value='fibonacci'>Fibonacci([0, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, '?', '☕'])</Option>
                <Option value='modifiedFibonacci'>Modified Fibonacci([0, '½', 1, 2, 3, 5, 8, 13, 20, 40, 100, '?', '☕'])</Option>
                <Option value='tshirts'>T-Shirts(['XS', 'S', 'M', 'L', 'XL', '?', '☕'])</Option>
                <Option value='powersOf2'>Powers of 2([0, 1, 2, 4, 8, 16, 32, 64, '?', '☕'])</Option>
              </Select>
            </Card>
          </div>
        )}
      </div>
      <div className='part2'>
        {isModerator && (
          <Button type='primary' onClick={toggleVoteVisibility}>
            {votesVisible ? 'Hide Votes' : 'Show Votes'}
          </Button>
        )}
        <Table dataSource={dataSource} columns={columns} pagination={false} />
      </div>
    </div>
  );
};

export default Voting;
