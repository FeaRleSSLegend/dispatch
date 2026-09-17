import pandas as pd

df = pd.read_csv("../data/incident_reports_dataset.csv")
# How many unique sentence templates does each category actually have?
print(df.groupby("category")["text"].nunique())
print("Total rows:", len(df))
print("Duplicate-flagged rows:", df["duplicate_of"].notna().sum())