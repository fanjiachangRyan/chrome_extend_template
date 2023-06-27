import {dealType} from "@/api/utils";
import MsgSend from "@/popup/pages/transactionDetail/message/msgSend";
import MsgDelegate from "@/popup/pages/transactionDetail/message/msgDelegate";
import MsgNewKyc from "@/popup/pages/transactionDetail/message/msgNewKyc";
import MsgSetFixedDepositInterestRate from "@/popup/pages/transactionDetail/message/msgSetFixedDepositInterestRate";
import MsgSendToAdmin from "@/popup/pages/transactionDetail/message/msgSendToAdmin";
import MsgSendToTreasury from "@/popup/pages/transactionDetail/message/msgSendToTreasury";
import MsgCreateValidator from "@/popup/pages/transactionDetail/message/msgCreateValidator";
import MsgStaking from "@/popup/pages/transactionDetail/message/msgStaking";
import MsgUnstake from "@/popup/pages/transactionDetail/message/msgUnstake";
import MsgEditValidator from "@/popup/pages/transactionDetail/message/msgEditValidator";
import MsgNewRegion from "@/popup/pages/transactionDetail/message/msgNewRegion";
import MsgUndelegate from "@/popup/pages/transactionDetail/message/msgUndelegate";
import MsgDoFixedDeposit from "@/popup/pages/transactionDetail/message/msgDoFixedDeposit";
import MsgDoFixedWithdraw from "@/popup/pages/transactionDetail/message/msgDoFixedWithdraw";
import MsgWithdrawDelegatorReward from "@/popup/pages/transactionDetail/message/msgWithdrawDelegatorReward";

const Message = ({type = '', detail = {}}: any) => {
  const msgType = dealType(type)

  if (msgType === 'Send') {
    return <MsgSend detail={detail}/>
  }

  if (msgType === 'Delegate') {
    return <MsgDelegate detail={detail}/>
  }

  if (msgType === 'NewKyc') {
    return <MsgNewKyc detail={detail}/>
  }

  if (msgType === 'SetFixedDepositInterestRate') {
    return <MsgSetFixedDepositInterestRate detail={detail}/>
  }

  if (msgType === 'SendToAdmin') {
    return <MsgSendToAdmin detail={detail}/>
  }

  if (msgType === 'SendToTreasury') {
    return <MsgSendToTreasury detail={detail}/>
  }

  if (msgType === 'CreateValidator') {
    return <MsgCreateValidator detail={detail}/>
  }

  if (msgType === 'Staking') {
    return <MsgStaking detail={detail}/>
  }

  if (msgType === 'Unstake') {
    return <MsgUnstake detail={detail}/>
  }

  if (msgType === 'EditValidator') {
    return <MsgEditValidator detail={detail}/>
  }

  if (msgType === 'NewRegion') {
    return <MsgNewRegion detail={detail}/>
  }

  if (msgType === 'Undelegate') {
    return <MsgUndelegate detail={detail}/>
  }

  if (msgType === 'DoFixedDeposit') {
    return <MsgDoFixedDeposit detail={detail} />
  }

  if (msgType === 'DoFixedWithdraw') {
    return <MsgDoFixedWithdraw detail={detail}/>
  }

  if (msgType === 'WithdrawDelegatorReward') {
    return <MsgWithdrawDelegatorReward detail={detail}/>
  }

  return <></>
}

export default Message
