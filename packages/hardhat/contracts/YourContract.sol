// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

/// @title RemittanceDapp - cUSD / ERC-20 Remittance Simulation
/// @author
/// @notice Basit bir remittance (para gönderme) akıllı kontratı. Gönderici token sözleşmesinde önce approve yapmalı.
/// @dev OpenZeppelin IERC20 + SafeERC20 kullanır.
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract RemittanceDapp is Ownable {
    using SafeERC20 for IERC20;

    uint256 private _txCount;

    struct RemitTx {
        uint256 id;
        address token;       // token contract (ör. cUSD)
        address sender;
        address recipient;
        uint256 amount;
        uint256 timestamp;
    }

    // id => RemitTx
    mapping(uint256 => RemitTx) private _transactions;

    // user address => list of tx ids (hem gönderen hem alıcı için tutulur)
    mapping(address => uint256[]) private _userTxIds;

    // Events
    event RemittanceSent(
        uint256 indexed id,
        address indexed token,
        address indexed sender,
        address recipient,
        uint256 amount,
        uint256 timestamp
    );

    event EmergencyWithdraw(address indexed token, address indexed to, uint256 amount);

    constructor() {
        _txCount = 0;
    }

    /// @notice Gönderici önce token kontratında approve(this, amount) çağrısı yapmalı.
    /// @param token Token contract address (ör. cUSD token address)
    /// @param recipient Alıcının wallet adresi
    /// @param amount Gönderilecek token miktarı (tokenın decimals'ına göre)
    function sendRemittance(
        address token,
        address recipient,
        uint256 amount
    ) external returns (uint256) {
        require(token != address(0), "Token address zero");
        require(recipient != address(0), "Recipient address zero");
        require(amount > 0, "Amount must be > 0");
        require(msg.sender != recipient, "Sender and recipient must differ");

        IERC20 tok = IERC20(token);

        // transferFrom: göndericiden kontrata değil doğrudan alıcıya çekip gönderiyoruz
        // Bu yaklaşım: kontratın ara hesap tutmasına gerek bırakmaz; contract hiçbir surette
        // tokensal bakiye tutmamalı -- fakat transferFrom'dan önce approve gerekli olacaktır.
        // safeTransferFrom garanti sağlar (revert vs false).
        tok.safeTransferFrom(msg.sender, recipient, amount);

        // create tx record
        _txCount += 1;
        uint256 id = _txCount;

        RemitTx memory rtx = RemitTx({
            id: id,
            token: token,
            sender: msg.sender,
            recipient: recipient,
            amount: amount,
            timestamp: block.timestamp
        });

        _transactions[id] = rtx;
        _userTxIds[msg.sender].push(id);
        _userTxIds[recipient].push(id);

        emit RemittanceSent(id, token, msg.sender, recipient, amount, block.timestamp);

        return id;
    }

    /* -------------------------------------------
       View fonksiyonları - frontend için
       ------------------------------------------- */

    /// @notice Belirli bir işlem kaydını getirir
    function getTransaction(uint256 id) external view returns (RemitTx memory) {
        require(id > 0 && id <= _txCount, "Invalid tx id");
        return _transactions[id];
    }

    /// @notice Bir kullanıcının (gönderen veya alıcı) işlem id listesini getirir
    function getUserTransactionIds(address user) external view returns (uint256[] memory) {
        return _userTxIds[user];
    }

    /// @notice Sözleşme üzerinde kazara kalan token'ları kurtarmak için ONLY OWNER (opsiyonel).
    /// @dev Normal işleyişte kontrat token tutmaz; bu fonksiyon sadece acil durum içindir.
    function emergencyWithdrawToken(address token, address to, uint256 amount) external onlyOwner {
        require(to != address(0), "To address zero");
        require(token != address(0), "Token address zero");
        IERC20 tok = IERC20(token);
        tok.safeTransfer(to, amount);
        emit EmergencyWithdraw(token, to, amount);
    }

    /// @notice Toplam işlem sayısını döner
    function totalTransactions() external view returns (uint256) {
        return _txCount;
    }
}
