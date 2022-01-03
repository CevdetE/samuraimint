pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract NFT is ERC721URIStorage {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    address public owner=0xCDeF3CC7cDBdC8695674973Ad015D9f2B01dD4C4;
    uint public normalPrice =20000000000000000; //0.02 eth (one nft)
    uint public whiteListPrice=10000000000000000; //0.01 eth
    uint public maxMint=100;
    address[] public whitelist=[0xCDeF3CC7cDBdC8695674973Ad015D9f2B01dD4C4,0x7d477dd546090EBF7dB262ED23CAb058623B97b8];
    uint public totalMint=0;

    constructor() ERC721("Undefeated Samurai", "USNFT") {
    }


    receive() external payable {} 
    
     modifier onlyOwner{
        require(
            msg.sender==owner,"ADMIN_ONLY"
        );
        _;
    }

    function awardItem(address player, string[] memory tokenURI) public payable{
        bool whitelisted=false;
        bool whitelistedPriceBool=false;
        for (uint8 i=0;i<whitelist.length;i++){
            if(whitelist[i]==msg.sender){
                whitelisted=true;
            }
        }

        require((tokenURI.length*normalPrice<=msg.value)&&(!((maxMint-tokenURI.length)<=0))||(whitelisted));
        if(whitelisted){
            whitelistedPriceBool=(msg.value>=(whiteListPrice*tokenURI.length));
            require(whitelistedPriceBool);
        }
        
        for (uint i=0; i<tokenURI.length; i++) {
        uint256 newItemId = _tokenIds.current();
        _tokenIds.increment();
        _mint(player, newItemId);
        _setTokenURI(newItemId, tokenURI[i]);
        totalMint++;
        }
    }


    function claimBalance(uint withdrawAmount) external payable onlyOwner{
        payable(msg.sender).transfer(withdrawAmount);

    }
    function sendBalance(uint withdrawAmount,address adres) external payable onlyOwner{
         payable(adres).transfer(withdrawAmount);
    }
    function changeOwner(address adres) external payable onlyOwner{
        owner=adres;
    }
    function getWhiteListAddress() public view returns(address[] memory){
        return whitelist;
    }

    
}