# Double or nothing

This app is a gambling app, to be run on an Etherium network. The user bets an amount of money (in ETH), and has a 50% chance of either winning a double amount, either loosing the betted amount. 

For this, the user interacts with a smart contract, deployed on an Etherium network, via an web application. There are 2 versions of this app:
 - the simple version; the smart contract 'throws a dice' by calling `block.timestamp % 2` 
 - the more complex version, that calls an oracle to 'throw a dice'; this solution is placed inside the `smart-contract` folder.

 The simpler version can be run on a locally running test network, using Ganache and Truffle Suite. For this, run [Ganache](https://www.trufflesuite.com/ganache) locally. Use [Truffle](https://www.trufflesuite.com/truffle) to complile the smart contract and deploy it. 

 Since this simpler verson doesn't has a proper random function, the more complex version uses the Provable oracle to get an random number. 
 Since receiving a value from an oracle is not possible on a local Etherium network, the contract needs to be deployed on a test network like Ropsten. 

 To interact with the deployed contract, in both cases, a web server needs to serve the web app. For this, use the terminal to run, in the folder where 
 the web app is located, `python3 -m htt.server`. Thus, the web app can be located on localhost:8080 . Now, a player can use MetaMask to use the app.