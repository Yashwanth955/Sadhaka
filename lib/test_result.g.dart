// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'test_result.dart';

// **************************************************************************
// TypeAdapterGenerator
// **************************************************************************

class TestResultAdapter extends TypeAdapter<TestResult> {
  @override
  final int typeId = 2;

  @override
  TestResult read(BinaryReader reader) {
    final numOfFields = reader.readByte();
    final fields = <int, dynamic>{
      for (int i = 0; i < numOfFields; i++) reader.readByte(): reader.read(),
    };
    return TestResult()
      ..testTitle = fields[0] as String
      ..resultValue = fields[1] as String
      ..date = fields[2] as DateTime
      ..videoPath = fields[3] as String?;
  }

  @override
  void write(BinaryWriter writer, TestResult obj) {
    writer
      ..writeByte(4)
      ..writeByte(0)
      ..write(obj.testTitle)
      ..writeByte(1)
      ..write(obj.resultValue)
      ..writeByte(2)
      ..write(obj.date)
      ..writeByte(3)
      ..write(obj.videoPath);
  }

  @override
  int get hashCode => typeId.hashCode;

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is TestResultAdapter &&
          runtimeType == other.runtimeType &&
          typeId == other.typeId;
}
