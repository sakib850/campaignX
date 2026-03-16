import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import accuracy_score, classification_report
import joblib
import os

def train_model():
    csv_path = "../data/uploaded_dataset.csv"
    model_path = "../data/trained_model.pkl"
    encoder_path = "../data/label_encoders.pkl"
    
    print(f"Loading custom biased dataset from: {csv_path}...")
    df = pd.read_csv(csv_path)
    
    # We will train the model to predict 'App_Installed' as an engagement metric
    target_col = 'App_Installed'
    
    # Drop columns that shouldn't be trained on (IDs, Emails, Names)
    drop_cols = ['customer_id', 'Full_name', 'email']
    df_clean = df.drop(columns=drop_cols)
    
    # Separate features and target
    y = df_clean[target_col]
    X = df_clean.drop(columns=[target_col])
    
    # Encode categorical variables
    label_encoders = {}
    print("Encoding categorized columns...")
    for col in X.select_dtypes(include=['object']).columns:
        le = LabelEncoder()
        X[col] = le.fit_transform(X[col].astype(str))
        label_encoders[col] = le
        
    y_encoder = LabelEncoder()
    y = y_encoder.fit_transform(y.astype(str))
    label_encoders[target_col] = y_encoder
    
    # Train/Test Split (80/20)
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    print(f"Training RandomForestClassifier on {len(X_train)} samples...")
    # Train the Supervised Learning Model
    rf = RandomForestClassifier(n_estimators=100, random_state=42, max_depth=10)
    rf.fit(X_train, y_train)
    
    # Predict and Verify the Bias / Accuracies
    y_pred = rf.predict(X_test)
    acc = accuracy_score(y_test, y_pred)
    
    print("\n--------- MODEL EVALUATION ---------")
    print(f"Accuracy on Test Set (20%): {acc * 100:.2f}%")
    print("\nClassification Report:")
    print(classification_report(y_test, y_pred, target_names=y_encoder.classes_))
    
    # Feature Importance to highlight our engineered biases
    importances = list(zip(X.columns, rf.feature_importances_))
    importances.sort(key=lambda x: x[1], reverse=True)
    print("\nTop 5 Predictive Features (Bias confirmation):")
    for feat, imp in importances[:5]:
        print(f" -> {feat}: {imp:.4f}")
        
    # Save the model and encoders
    joblib.dump(rf, model_path)
    joblib.dump(label_encoders, encoder_path)
    print(f"\nModel strictly saved to {model_path}!")

if __name__ == "__main__":
    train_model()
