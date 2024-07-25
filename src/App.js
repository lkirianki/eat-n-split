import { useState } from "react";

const initialFriends = [
  {
    id: 118836,
    name: "Clark",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: 933372,
    name: "Sarah",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: 499476,
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];

function Button({ children, onClick }) {
  return <button className="button" onClick={onClick}>{children}</button>
}

export default function App() {

  const [showfriendform, setShowfriendForm] = useState(false);
  const [friends, setFriends] = useState(initialFriends);
  const [selectFriend, setSelectFriend] = useState(null)

  const toggleAddFriendForm = () => {
    setShowfriendForm(showfriendform => !showfriendform);
    setSelectFriend(null);
  }

  const handleAddFriend = (newfriend) => {
    setFriends(oldfriends => [...oldfriends, newfriend]);
    setShowfriendForm(false)
  }

  const handleselectedFriend = (friend) => {
    // setSelectFriend(friend)
    setSelectFriend(curr => curr?.id === friend.id ? null : friend)
    setShowfriendForm(false)
  }

  const handleSplitBill = (value) => {
    setFriends(friends => friends.map(
      friend => friend.id === selectFriend.id ? { ...friend, balance: friend.balance + value } : friend
    ));
    setSelectFriend(null)
  }


  return <div className="app">
    <div className="sidebar">
      <FriendsList friends={friends} onSelection={handleselectedFriend} selectFriend={selectFriend} />

      {showfriendform && <FormAddFriend addFriend={handleAddFriend} />}

      <Button onClick={toggleAddFriendForm}>{showfriendform ? "close" : "add Friend"}</Button>
    </div>

    <div>
      {selectFriend && <FormSplitBill selectFriend={selectFriend} onSplitBill={handleSplitBill} />}
    </div>

  </div>
}

function FriendsList({ friends, onSelection, selectFriend }) {

  return <ul>
    {friends.map(friend => <Friend friend={friend} key={friend.id} onSelection={onSelection} selectFriend={selectFriend} />)}
  </ul>
}

function Friend({ friend, onSelection, selectFriend }) {

  const isSelected = selectFriend?.id === friend.id;

  return (
    <li className={isSelected ? "selected" : ''}>
      <img src={friend.image} alt={friend.name} />
      <h3>{friend.name}</h3>

      {friend.balance < 0 && <p className="red">you owe {friend.name} ${Math.abs(friend.balance)}</p>}
      {friend.balance > 0 && <p className="green">{friend.name} owes you ${Math.abs(friend.balance)}</p>}
      {friend.balance === 0 && <p >you and {friend.name} are even</p>}

      <Button onClick={() => onSelection(friend)}>{isSelected ? "close" : 'select'}</Button>
    </li >
  )

}


function FormAddFriend({ addFriend, }) {

  const [name, setName] = useState('')
  const [image, setImage] = useState('https://i.pravatar.cc/48')

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !image) return;
    const id = crypto.randomUUID()
    const newfriend = {
      name: name,
      image: `${image}?=${id}`,
      balance: 0,
      id: id
    }
    addFriend(newfriend)
    // console.log(newfriend)
    setName('');
    setImage('https://i.pravatar.cc/48')

  }

  const handleImage = (e) => setImage(e.target.value)
  return <form className="form-add-friend" onSubmit={handleSubmit}>
    <label htmlFor="friend-name">👩🏼‍🤝‍🧑🏼Friend name:</label>
    <input type="text" id="friend-name" value={name} onChange={(e) => setName(e.target.value)} />

    <label htmlFor="image"> 📷 image URL:</label>
    <input type="text" id="image" value={image} onChange={e => handleImage(e)} />

    <Button>Add</Button>
  </form>
}

function FormSplitBill({ selectFriend, onSplitBill }) {

  const [bill, setBill] = useState('');
  const [paidByUser, setPaidByUser] = useState('');
  const paidByfriend = bill ? bill - paidByUser : ''
  const [whoIsPaying, setwhoIsPaying] = useState('user');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!bill || !paidByUser) return;
    onSplitBill(whoIsPaying === 'user' ? paidByfriend : -paidByUser)
  }

  return (
    <form className="form-split-bill" onSubmit={handleSubmit}>
      <h2>split bill with {selectFriend.name}</h2>

      <label htmlFor="bill">💰 bill value</label>
      <input type="text" value={bill} onChange={(e) => setBill(Number(e.target.value))} />

      <label htmlFor="your">🚶‍♂️ your expense/label</label>
      <input type="text" value={paidByUser} onChange={(e) => setPaidByUser(
        Number(e.target.value) > bill ? paidByUser : Number(e.target.value)
      )} />

      <label htmlFor="friends">💲 {selectFriend.name} expenses</label>
      <input type="text" value={paidByfriend} disabled />

      <label htmlFor="payingBill">😛 who is paying the bill</label>
      <select value={whoIsPaying} onChange={(e) => setwhoIsPaying(e.target.value)}>
        <option value='user'>you</option>
        <option value={selectFriend.name}>{selectFriend.name}</option>
      </select>
      <Button>spilit bill</Button>
    </form>

  )
}