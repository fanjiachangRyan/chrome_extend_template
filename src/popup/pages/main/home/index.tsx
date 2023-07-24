import styles from "./index.less";
import { useEffect, useState } from "react";
import { useRequest } from "ahooks";
import {
  connect,
  getBalanceByAddress,
  getCurrentAccount,
  getDelegationAmount,
  getDepositAnnualRateList,
  getFixedDeposit,
} from "@/api";
import { formatCountByDenom, storage } from "@/api/utils";
import scan from "@/assets/images/scan.png";
import send from "@/assets/images/send.png";
import stake from "@/assets/images/stake.png";
import { InboxOutlined } from "@ant-design/icons";
import Define from "@/popup/define";
import LoadingView from "@/popup/components/loadingView";
import { useNavigate } from "react-router";
import { Modal } from "antd";
import QRCode from "qrcode.react";

const HomeSubject = ({ subject = "" }: any) => (
  <p className={styles.homeSubject}>{subject}</p>
);

const Home = () => {
  const [currentAccount, setCurrentAccount] = useState<any>({});
  const [coin, setCoin] = useState<Record<string, any>>({});
  const [delegateAmount, setDelegateAmount] = useState<string>("0");
  const [maxRate, setMaxRate] = useState<string>("0%");
  const [showDeposit, setShowDeposit] = useState<boolean>(false);

  const navigator = useNavigate();

  useRequest(() => getCurrentAccount(), {
    ready: true,
    refreshDeps: [],
    onSuccess: async (res: any) => {
      setCurrentAccount(() => res);
      await connect();
      getBalanceByAddressAction.run(res.address || "");
    },
  });

  useEffect(() => {
    storage.set({ connectStatus: true });
  }, []);

  useRequest(() => getFixedDeposit(currentAccount.address), {
    ready: !!currentAccount.address,
    refreshDeps: [currentAccount.address],
    onSuccess: (res: any) => {
      const { FixedDeposit = [] } = res ?? {};
      const amount: any = FixedDeposit.reduce((prev: number, item: any) => {
        prev += (item.principal?.amount || 0) * 1;

        return prev;
      }, 0);

      setDelegateAmount((prev: any) => `${prev * 1 + amount * 1}`);

      run(currentAccount.address);
    },
  });

  const { run } = useRequest(getDelegationAmount, {
    manual: true,
    onSuccess: (res: any) => {
      const { balance = {} } = res?.delegation_response ?? {};

      setDelegateAmount(
        (prev: any) => `${prev * 1 + (balance.amount || 0) * 1}`
      );
    },
  });

  useRequest(() => getDepositAnnualRateList(), {
    ready: true,
    refreshDeps: [],
    onSuccess: (res: any) => {
      const { FixedDepositAnnualRate = {} }: any = res ?? {};

      const values = Object.values(FixedDepositAnnualRate) ?? [];

      const _values = values.map((item: any) => item * 1);

      const maxVal = _values.reduce(
        (prev: number, item: any) => (item > prev ? item : prev),
        0
      );

      setMaxRate(() => `${maxVal * 100}%`);
    },
  });

  const getBalanceByAddressAction = useRequest(getBalanceByAddress, {
    manual: true,
    onSuccess: (res: any) => {
      const { balances = [] } = res;
      const _coins: any[] = balances.map((item: any) =>
        formatCountByDenom(item.denom, item.amount)
      );
      const mec = _coins.find((item: any) => item.denom === "MEC") ?? {};

      setCoin(() => ({ ...mec }));
    },
  });

  if (getBalanceByAddressAction.loading) {
    return (
      <div className={styles.home}>
        <LoadingView />
      </div>
    );
  }

  return (
    <div className={styles.home}>
      <div className={styles.coins}>
        <div className={styles.coins_count}>
          <p>{coin.amount || "0"}</p>
          <span>{coin.denom || Define.COIN_NAME}</span>
        </div>
        <p className={styles.coins_description}>Net assets</p>
      </div>
      <div className={styles.handle}>
        <div
          className={styles.handle_button}
          onClick={() => {
            setShowDeposit(() => true);
          }}
        >
          <img src={scan} alt="" />
          <p>Deposit</p>
        </div>
        <div
          className={styles.handle_button}
          onClick={() => navigator("/send")}
        >
          <img src={send} alt="" />
          <p>Send</p>
        </div>
      </div>
      <HomeSubject subject={`${Define.COIN} STAKE`} />
      <div
        className={[styles.wrap, styles.stake].join(" ")}
        onClick={() => navigator("/selectStake")}
      >
        <img src={stake} alt="" />
        <div className={styles.stake_content}>
          <p className={styles.stake_content_title}>
            {delegateAmount != "0" ? "Currently Staked" : `Stake & Earn`}
          </p>
          <p className={styles.stake_content_detail}>
            {maxRate} <span>MAX APY</span>
          </p>
        </div>
      </div>
      <HomeSubject subject={"MY DELEGATE"} />
      <div className={[styles.wrap, styles.delegate].join(" ")}>
        <div className={styles.delegate_coinName}>
          <InboxOutlined />
          <p>{Define.COIN}</p>
        </div>
        <p className={styles.delegate_count}>
          <span>
            {formatCountByDenom("umec", delegateAmount || "0").amount || "0"}
          </span>
          <span className={styles.delegate_count_coin}>{Define.COIN}</span>
        </p>
      </div>
      <Modal
        wrapClassName={styles.modal}
        centered
        open={showDeposit && !!currentAccount.address}
        footer={false}
        onCancel={() => setShowDeposit(false)}
      >
        <QRCode
          includeMargin={true}
          value={currentAccount.address}
          size={150}
          fgColor={"#000000"}
        />
      </Modal>
    </div>
  );
};

export default Home;
