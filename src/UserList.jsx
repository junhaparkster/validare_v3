import React, { useState, useEffect } from 'react';
    import { useSearchParams } from 'react-router-dom';
    import './UserList.css';

    const UserList = () => {
      const [searchParams] = useSearchParams();
      const [users, setUsers] = useState(null);
      const query = searchParams.get('query');

      useEffect(() => {
        const fetchUsers = async () => {
          try {
            const response = await fetch(`/api/generate-users?query=${query}`);
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setUsers(data.users);
          } catch (error) {
            console.error("Could not fetch user list:", error);
          }
        };

        if (query) {
          fetchUsers();
        }
      }, [query]);

      if (!users) {
        return <div className="user-list-container">Loading...</div>;
      }

      return (
        <div className="user-list-container">
          <h1>User List for: {query}</h1>
          <ul className="user-list">
            {users.map((user, index) => (
              <li key={index} className="user-item">
                <a href={user.profileLink} target="_blank" rel="noopener noreferrer">
                  {user.username}
                </a>
              </li>
            ))}
          </ul>
        </div>
      );
    };

    export default UserList;
