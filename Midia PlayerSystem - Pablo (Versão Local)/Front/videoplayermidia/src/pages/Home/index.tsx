import './style.css'

function Home() {
  

  return (
    
      <div className='Container'>
        <form>
          <h1> Cadastro e Log-in Crialed</h1>
          <input placeholder= "Username" name = "User_name" type= 'text'/>
          <input placeholder= "Password" name = "User_password" type= 'password'/>
          <button type='button'>Log-in</button>
          <button type='button'> cadastro</button>
        </form>
      </div>
  )
}

export default Home
