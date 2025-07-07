// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "@openzeppelin/contracts/utils/Address.sol";

/**
 * @title DurationDonation
 * @dev A contract for managing charitable donations in native tokens (GLMR/DOT.xc)
 */
contract DurationDonation is Ownable, ReentrancyGuard, Pausable {
    using Address for address payable;

    struct Charity {
        bool isRegistered;
        address payable walletAddress;
        uint256 totalReceived;
        uint256 availableBalance;
        bool isActive;
        uint256 lastWithdrawal;
    }
    
    mapping(address => Charity) public charities;
    mapping(address => mapping(address => uint256)) public donations; // donor => charity => amount
    
    uint256 public constant MINIMUM_DONATION = 0.0001 ether; // Minimum donation amount
    uint256 public constant MAXIMUM_DONATION = 1000000 ether; // Maximum donation amount (1M)
    uint256 public constant WITHDRAWAL_COOLDOWN = 1 days; // Minimum time between withdrawals
    
    event CharityRegistered(address indexed charity, uint256 timestamp);
    event CharityStatusUpdated(address indexed charity, bool isActive);
    event DonationReceived(
        address indexed donor,
        address indexed charity,
        uint256 amount,
        uint256 timestamp
    );
    event WithdrawalProcessed(
        address indexed charity,
        uint256 amount,
        uint256 timestamp
    );
    
    error InvalidAmount(uint256 amount, string reason);
    error CharityNotRegistered(address charity);
    error CharityNotActive(address charity);
    error WithdrawalTooSoon(uint256 timeRemaining);
    error InsufficientBalance(uint256 requested, uint256 available);
    
    constructor() Ownable(msg.sender) {}
    
    /**
     * @dev Register a new charity
     * @param charityAddress The address of the charity to register
     */
    function registerCharity(address payable charityAddress) external onlyOwner {
        require(charityAddress != address(0), "Invalid charity address");
        require(!charities[charityAddress].isRegistered, "Charity already registered");
        
        charities[charityAddress] = Charity({
            isRegistered: true,
            walletAddress: charityAddress,
            totalReceived: 0,
            availableBalance: 0,
            isActive: true,
            lastWithdrawal: 0
        });
        
        emit CharityRegistered(charityAddress, block.timestamp);
    }

    /**
     * @dev Update charity active status
     * @param charityAddress The address of the charity
     * @param isActive New active status
     */
    function updateCharityStatus(address charityAddress, bool isActive) external onlyOwner {
        if (!charities[charityAddress].isRegistered) {
            revert CharityNotRegistered(charityAddress);
        }
        
        charities[charityAddress].isActive = isActive;
        emit CharityStatusUpdated(charityAddress, isActive);
    }
    
    /**
     * @dev Make a donation to a charity
     * @param charityAddress The address of the charity to donate to
     */
    function donate(address charityAddress) external payable nonReentrant whenNotPaused {
        if (!charities[charityAddress].isRegistered) {
            revert CharityNotRegistered(charityAddress);
        }
        
        if (!charities[charityAddress].isActive) {
            revert CharityNotActive(charityAddress);
        }
        
        if (msg.value < MINIMUM_DONATION || msg.value > MAXIMUM_DONATION) {
            revert InvalidAmount(msg.value, "Amount outside allowed range");
        }
        
        Charity storage charity = charities[charityAddress];
        
        // Update balances
        charity.totalReceived += msg.value;
        charity.availableBalance += msg.value;
        donations[msg.sender][charityAddress] += msg.value;
        
        emit DonationReceived(msg.sender, charityAddress, msg.value, block.timestamp);
    }
    
    /**
     * @dev Withdraw funds from charity balance
     * @param amount Amount to withdraw
     */
    function withdraw(uint256 amount) external nonReentrant whenNotPaused {
        Charity storage charity = charities[msg.sender];
        
        if (!charity.isRegistered) {
            revert CharityNotRegistered(msg.sender);
        }
        
        if (!charity.isActive) {
            revert CharityNotActive(msg.sender);
        }
        
        if (amount == 0 || amount > charity.availableBalance) {
            revert InsufficientBalance(amount, charity.availableBalance);
        }
        
        // Check withdrawal cooldown
        if (block.timestamp < charity.lastWithdrawal + WITHDRAWAL_COOLDOWN) {
            revert WithdrawalTooSoon(
                (charity.lastWithdrawal + WITHDRAWAL_COOLDOWN) - block.timestamp
            );
        }
        
        charity.availableBalance -= amount;
        charity.lastWithdrawal = block.timestamp;
        
        // Transfer using Address library's sendValue for safety
        charity.walletAddress.sendValue(amount);
        
        emit WithdrawalProcessed(msg.sender, amount, block.timestamp);
    }
    
    /**
     * @dev Get charity information
     * @param charityAddress The address of the charity
     */
    function getCharityInfo(address charityAddress) external view returns (
        bool isRegistered,
        address walletAddress,
        uint256 totalReceived,
        uint256 availableBalance,
        bool isActive,
        uint256 lastWithdrawal
    ) {
        Charity storage charity = charities[charityAddress];
        return (
            charity.isRegistered,
            charity.walletAddress,
            charity.totalReceived,
            charity.availableBalance,
            charity.isActive,
            charity.lastWithdrawal
        );
    }
    
    /**
     * @dev Get donation amount from donor to charity
     * @param donor The donor address
     * @param charity The charity address
     */
    function getDonationAmount(
        address donor,
        address charity
    ) external view returns (uint256) {
        return donations[donor][charity];
    }

    /**
     * @dev Pause the contract
     * Only owner can call this function
     */
    function pause() external onlyOwner {
        _pause();
    }

    /**
     * @dev Unpause the contract
     * Only owner can call this function
     */
    function unpause() external onlyOwner {
        _unpause();
    }

    /**
     * @dev Fallback function to accept native token donations
     */
    receive() external payable {
        revert("Use donate() function to make donations");
    }

    /**
     * @dev Fallback function for unknown function calls
     */
    fallback() external {
        revert("Function not found");
    }
}