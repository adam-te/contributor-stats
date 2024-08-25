import fs from "fs";
import path from "path";

export { ensureData };

interface EnsureData<T> {
  value: T;
  lastUpdated: number;
}

async function ensureData<T>({
  filePath,
  getFreshData,
}: {
  filePath: string;
  getFreshData: () => Promise<T>;
}): Promise<T> {
  const fullPath = path.resolve(filePath);

  fs.mkdirSync(path.dirname(fullPath), { recursive: true }); // Ensure the directory exists, create it if it doesn't

  if (fs.existsSync(fullPath)) {
    const cachedData: EnsureData<T> = JSON.parse(
      fs.readFileSync(fullPath, "utf8")
    );

    if (!isStale(cachedData)) {
      return cachedData.value;
    }
  }

  const freshData = await getFreshData();
  fs.writeFileSync(
    fullPath,
    JSON.stringify(
      {
        value: freshData,
        lastUpdated: Date.now(),
      },
      null,
      2
    ),
    "utf8"
  );
  return freshData;
}

function isStale(value: EnsureData<any>) {
  // ADAMTODO:
  return false;
  // return (
  //   value && value.lastUpdated && !isMoreThanOneMonthAgo(value.lastUpdated)
  // );
}
function isMoreThanOneMonthAgo(value: number): boolean {
  const lastUpdatedDate = new Date(value);
  const currentDate = new Date();
  const oneMonthAgo = new Date(
    currentDate.setMonth(currentDate.getMonth() - 1)
  );
  return lastUpdatedDate >= oneMonthAgo;
}
