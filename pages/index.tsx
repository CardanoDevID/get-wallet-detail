import { useEffect, useState } from "react";
import {
  useWallet,
  useWalletList,
  useAddress,
  useLovelace,
  useAssets,
  useNetwork,
} from "@meshsdk/react";

interface WalletAttributes {
  icon: string;
  name: string;
  version: string;
}

interface AssetAttributes {
  unit: string;
  policyId: string;
  assetName: string;
  fingerprint: string;
  quantity: string;
}

export default function Home() {
  const { connect, disconnect, connecting, connected } = useWallet();
  const wallets = useWalletList();
  const address = useAddress();
  const lovelace = useLovelace();
  const assets = useAssets();
  const network = useNetwork();

  const [walletAttributes, setWalletAttributes] = useState<WalletAttributes>({
    icon: "",
    name: "",
    version: "",
  });

  const [assetAttributes, setAssetAttributes] = useState<AssetAttributes>({
    unit: "",
    policyId: "",
    assetName: "",
    fingerprint: "",
    quantity: "",
  });

  const ConnectHandler = async (
    icon: string,
    name: string,
    version: string
  ) => {
    console.log(`${name} Clicked!`);

    setWalletAttributes({
      icon,
      name,
      version,
    });

    try {
      await connect(name);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    console.log("Wallet list:", wallets);
  }, [wallets]);

  useEffect(() => {
    console.log("Status connect:", connected);
  }, [connected]);

  return (
    <>
      {!connected ? (
        <div className="flex justify-center items-center h-screen bg-black text-white">
          <div className="border border-white rounded-3xl px-16 py-4">
            <h1 className="text-center text-2xl font-bold">Wallet List :</h1>
            <div className="flex justify-center items-center">
              {wallets.map((wallet, i) => {
                return (
                  <div key={i}>
                    <div
                      className="flex items-center justify-center"
                      onClick={() =>
                        ConnectHandler(wallet.icon, wallet.name, wallet.version)
                      }
                    >
                      <div className="border border-black bg-gray-700 rounded-xl mx-2 my-4 p-3 hover:border hover:border-white text-center">
                        <img src={wallet.icon} style={{ width: "48px" }} />
                        <b>{wallet.name}</b>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-black text-white h-screen flex justify-center items-center">
          <div className="border border-white rounded-3xl px-16 py-4">
            <h1 className="text-center text-2xl font-bold">Wallet Detail :</h1>
            <div className="flex justify-center item-center">
              <div className="text-center">
                <div className=" bg-gray-700 rounded-xl mx-2 mt-4 mb-1 p-3">
                  <img src={walletAttributes.icon} style={{ width: "48px" }} />
                  <b>v {walletAttributes.version}</b>
                </div>
                <p className="font-semibold">
                  {network === 0 ? "Preprod" : "Mainnet"}
                </p>
              </div>
              <div className="mt-4 ml-4">
                <div className="flex mb-3">
                  <div className="w-28 font-bold py-1">Address</div>
                  <div className="bg-gray-600 rounded-sm px-4 py-1 w-228">
                    {address}
                  </div>
                </div>
                <div className="flex mb-3">
                  <div className="w-28 font-bold py-1">Balance</div>
                  <div className="bg-gray-600 rounded-sm px-4 py-1 w-56">
                    {lovelace} Lovelace
                  </div>
                </div>
                <div className="flex mb-3">
                  <div className="w-28 font-bold py-1">Token List</div>
                  <select
                    className="bg-gray-600 rounded-sm px-4 py-1 w-56"
                    onChange={(e) => {
                      const selectedAsset = assets.find(
                        (asset) => asset.assetName === e.target.value
                      );

                      if (selectedAsset) {
                        setAssetAttributes({
                          unit: selectedAsset.unit,
                          policyId: selectedAsset.policyId,
                          assetName: selectedAsset.assetName,
                          fingerprint: selectedAsset.fingerprint,
                          quantity: selectedAsset.quantity,
                        });
                      } else {
                        setAssetAttributes({
                          unit: "",
                          policyId: "",
                          assetName: "",
                          fingerprint: "",
                          quantity: "",
                        });
                      }
                    }}
                  >
                    <option>Select Token</option>
                    {assets?.map((asset, i) => (
                      <option key={i} value={asset.assetName}>
                        {asset.assetName}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex mb-6">
                  <div className="w-28 font-bold py-1">Token Detail</div>
                  <div className="bg-gray-600 rounded-sm px-4 py-6 h-64 w-228">
                    <div className="flex mb-3">
                      <div className="w-24 font-bold py-1">Unit</div>
                      <div className="bg-gray-500 rounded-sm px-4 py-1 w-200">
                        <p>{assetAttributes.unit}</p>
                      </div>
                    </div>
                    <div className="flex mb-3">
                      <div className="w-24 font-bold py-1">policyId</div>
                      <div className="bg-gray-500 rounded-sm px-4 py-1 w-200">
                        <p>{assetAttributes.policyId}</p>
                      </div>
                    </div>
                    <div className="flex mb-3">
                      <div className="w-24 font-bold py-1">assetName</div>
                      <div className="bg-gray-500 rounded-sm px-4 py-1 w-200">
                        <p>{assetAttributes.assetName}</p>
                      </div>
                    </div>
                    <div className="flex mb-3">
                      <div className="w-24 font-bold py-1">fingerprint</div>
                      <div className="bg-gray-500 rounded-sm px-4 py-1 w-200">
                        <p>{assetAttributes.fingerprint}</p>
                      </div>
                    </div>
                    <div className="flex mb-3">
                      <div className="w-24 font-bold py-1">quantity</div>
                      <div className="bg-gray-500 rounded-sm px-4 py-1 w-200">
                        <p>{assetAttributes.quantity}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-center items-center">
              <button
                className="bg-blue-500 hover:bg-blue-700 rounded-xl w-32 h-8 font-bold"
                onClick={async () => {
                  setWalletAttributes({
                    icon: "",
                    name: "",
                    version: "",
                  });

                  setAssetAttributes({
                    unit: "",
                    policyId: "",
                    assetName: "",
                    fingerprint: "",
                    quantity: "",
                  });
                  disconnect();
                }}
              >
                Disconnect
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
